using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Services;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Data;

namespace ZombieLynxPortalAPI.Services.Ark
{
    public class ArkPointsSyncService
    {
        private readonly PointsDbConnectionService _connectionService;
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;

        public ArkPointsSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task SyncPendingPointsAsync()
        {
            var connString = _connectionService.GetConnectionString("ArkShop");

            var optionsBuilder = new DbContextOptionsBuilder<ArkShopDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var arkContext = new ArkShopDbContext(optionsBuilder.Options);
            var allRows = await arkContext.PointsSyncQueue.ToListAsync();

            var pendingRows = allRows
                .GroupBy(row => row.SteamId)
                .Select(g => g.OrderByDescending(r => r.CreatedAt).First())
                .ToList();


            Console.WriteLine($"🔎 Found {pendingRows.Count} pending rows in ArkShop PointsSyncQueue.");

            foreach (var row in pendingRows)
            {
                var member = await _mainDbContext.ZLGMembers
                    .FirstOrDefaultAsync(m => m.SteamId == row.SteamId);

                if (member == null)
                {
                    continue;
                }

                // Update points with the most recent entry
                member.Points = row.Points;

                // Remove all rows for this SteamId
                var allForThisSteamId = arkContext.PointsSyncQueue
                    .Where(r => r.SteamId == row.SteamId);

                arkContext.PointsSyncQueue.RemoveRange(allForThisSteamId);

                Console.WriteLine($"✅ Synced SteamId {row.SteamId} → Points: {row.NewPoints} (and cleared all queue rows)");
            }
            // 🟩 Sync updated ZLGMember points to ASA (by EosId)
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
            // 🟩 Sync ZLGMember points to Minecraft (by MinecraftUuid)
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
            await arkContext.SaveChangesAsync();

            Console.WriteLine("💾 Sync complete and changes saved.");
        }

    }
}
