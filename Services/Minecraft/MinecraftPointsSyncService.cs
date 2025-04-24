using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Services;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Data;

namespace ZombieLynxPortalAPI.Services.Minecraft
{
    public class MinecraftPointsSyncService
    {
        private readonly PointsDbConnectionService _connectionService;
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;

        public MinecraftPointsSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task SyncPendingPointsAsync()
        {
            var connString = _connectionService.GetConnectionString("MinecraftPoints");

            var optionsBuilder = new DbContextOptionsBuilder<MinecraftPointsDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var mcContext = new MinecraftPointsDbContext(optionsBuilder.Options);
            var allRows = await mcContext.PointsSyncQueue.ToListAsync();

            var pendingRows = allRows
                .GroupBy(row => row.Uuid)
                .Select(g => g.OrderByDescending(r => r.CreatedAt).First())
                .ToList();

            Console.WriteLine($"🔎 Found {pendingRows.Count} pending rows in Minecraft PointsSyncQueue.");

            foreach (var row in pendingRows)
            {
                var member = await _mainDbContext.ZLGMembers
                    .FirstOrDefaultAsync(m => m.MinecraftUuid == row.Uuid);

                if (member == null)
                {
                    continue;
                }

                member.Points = row.Points;

                var allForThisUuid = mcContext.PointsSyncQueue
                    .Where(r => r.Uuid == row.Uuid);

                mcContext.PointsSyncQueue.RemoveRange(allForThisUuid);

                Console.WriteLine($"✅ Synced UUID {row.Uuid} → Points: {row.NewPoints} (and cleared all queue rows)");
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

            // 🟩 Sync ZLGMember points to ASA (by EosId)
            var asaConnString = _connectionService.GetConnectionString("AsaShop");
            var asaOptionsBuilder = new DbContextOptionsBuilder<AsaShopDbContext>();
            asaOptionsBuilder.UseMySQL(asaConnString);

            using (var asaContext = new AsaShopDbContext(asaOptionsBuilder.Options))
            {
                foreach (var member in _mainDbContext.ZLGMembers.Where(m => m.EosId != null))
                {
                    var asaPlayer = await asaContext.AsaShopPlayers
                        .FirstOrDefaultAsync(p => p.EosId == member.EosId);

                    if (asaPlayer != null)
                    {
                        asaPlayer.Points = member.Points;
                        Console.WriteLine($"🔁 Synced ASA → EosId: {member.EosId} → Points: {member.Points}");
                    }
                }

                await asaContext.SaveChangesAsync();
                Console.WriteLine("✅ ASA points sync complete.");
            }

            await _mainDbContext.SaveChangesAsync();
            await mcContext.SaveChangesAsync();

            Console.WriteLine("💾 Minecraft sync complete and changes saved.");
        }
    }
}
