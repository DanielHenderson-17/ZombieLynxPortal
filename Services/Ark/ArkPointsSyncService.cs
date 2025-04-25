using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;

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
            await SyncASEAsync();
            await SyncASAAsync();
            await SyncMinecraftAsync();

            await _mainDbContext.SaveChangesAsync();
            Console.WriteLine("💾 Sync complete and changes saved.");
        }

        private async Task SyncASEAsync()
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
                    continue;

                member.Points = row.Points;

                var allForThisSteamId = arkContext.PointsSyncQueue
                    .Where(r => r.SteamId == row.SteamId);

                arkContext.PointsSyncQueue.RemoveRange(allForThisSteamId);

                Console.WriteLine($"✅ Synced SteamId {row.SteamId} → Points: {row.Points} (cleared queue rows)");
            }

            await arkContext.SaveChangesAsync();
        }

        private async Task SyncASAAsync()
        {
            var connString = _connectionService.GetConnectionString("AsaShop");
            var optionsBuilder = new DbContextOptionsBuilder<AsaShopDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var asaContext = new AsaShopDbContext(optionsBuilder.Options);

            var eosMembers = await _mainDbContext.ZLGMembers
                .Where(m => m.EosId != null)
                .ToListAsync();

            foreach (var member in eosMembers)
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

        private async Task SyncMinecraftAsync()
        {
            var connString = _connectionService.GetConnectionString("MinecraftPoints");
            var optionsBuilder = new DbContextOptionsBuilder<MinecraftPointsDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var mcContext = new MinecraftPointsDbContext(optionsBuilder.Options);

            var mcMembers = await _mainDbContext.ZLGMembers
                .Where(m => m.MinecraftUuid != null)
                .ToListAsync();

            foreach (var member in mcMembers)
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
    }
}
