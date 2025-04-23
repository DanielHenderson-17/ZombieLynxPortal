using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Services;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Data;

namespace ZombieLynxPortalAPI.Services.Ark
{
    public class AsaPointsSyncService
    {
        private readonly PointsDbConnectionService _connectionService;
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;

        public AsaPointsSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task SyncPendingPointsAsync()
        {
            var connString = _connectionService.GetConnectionString("AsaShop");

            var optionsBuilder = new DbContextOptionsBuilder<AsaShopDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var asaContext = new AsaShopDbContext(optionsBuilder.Options);
            var allRows = await asaContext.PointsSyncQueue.ToListAsync();

            var pendingRows = allRows
                .GroupBy(row => row.EosId)
                .Select(g => g.OrderByDescending(r => r.CreatedAt).First())
                .ToList();

            Console.WriteLine($"🔎 Found {pendingRows.Count} pending rows in AsaShop PointsSyncQueue.");

            foreach (var row in pendingRows)
            {
                var member = await _mainDbContext.ZLGMembers
                    .FirstOrDefaultAsync(m => m.EosId == row.EosId);

                if (member == null)
                {
                    continue;
                }

                member.Points = row.Points;

                var allForThisEosId = asaContext.PointsSyncQueue
                    .Where(r => r.EosId == row.EosId);

                asaContext.PointsSyncQueue.RemoveRange(allForThisEosId);

                Console.WriteLine($"✅ Synced EosId {row.EosId} → Points: {row.NewPoints} (and cleared all queue rows)");
            }

            // 🟦 Sync ZLGMember points to ASE (by SteamId)
            var aseConnString = _connectionService.GetConnectionString("ArkShop");
            var aseOptionsBuilder = new DbContextOptionsBuilder<ArkShopDbContext>();
            aseOptionsBuilder.UseMySQL(aseConnString);

            using (var aseContext = new ArkShopDbContext(aseOptionsBuilder.Options))
            {
                foreach (var member in _mainDbContext.ZLGMembers.Where(m => m.SteamId != null))
                {
                    var arkPlayer = await aseContext.ArkShopPlayers
                        .FirstOrDefaultAsync(p => p.SteamId == ulong.Parse(member.SteamId));

                    if (arkPlayer != null)
                    {
                        arkPlayer.Points = member.Points;
                        Console.WriteLine($"🔁 Synced ASE → SteamId: {member.SteamId} → Points: {member.Points}");
                    }
                }

                await aseContext.SaveChangesAsync();
                Console.WriteLine("✅ ASE points sync complete.");
            }

            // 🟫 Sync ZLGMember points to Minecraft (by MinecraftUuid)
            var mcConnString = _connectionService.GetConnectionString("MinecraftPoints");
            var mcOptionsBuilder = new DbContextOptionsBuilder<MinecraftPointsDbContext>();
            mcOptionsBuilder.UseMySQL(mcConnString);

            using (var mcContext = new MinecraftPointsDbContext(mcOptionsBuilder.Options))
            {
                foreach (var member in _mainDbContext.ZLGMembers.Where(m => m.MinecraftUuid != null))
                {
                    var mcUser = await mcContext.CoinsEngineUsers
                        .FirstOrDefaultAsync(u => u.uuid == member.MinecraftUuid);

                    if (mcUser != null)
                    {
                        mcUser.coins = member.Points;
                        Console.WriteLine($"🟫 Synced Minecraft → UUID: {member.MinecraftUuid} → Coins: {member.Points}");
                    }
                }

                await mcContext.SaveChangesAsync();
                Console.WriteLine("✅ Minecraft coins sync complete.");
            }

            await _mainDbContext.SaveChangesAsync();
            await asaContext.SaveChangesAsync();

            Console.WriteLine("💾 ASA sync complete and changes saved.");
        }
    }
}
