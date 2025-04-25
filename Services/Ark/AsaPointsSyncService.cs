using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;

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
            await SyncASAAsync();
            await SyncASEAsync();
            await SyncMinecraftAsync();

            await _mainDbContext.SaveChangesAsync();
            Console.WriteLine("💾 ASA sync complete and changes saved.");
        }

        private async Task SyncASAAsync()
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
                    continue;

                member.Points = row.Points;

                var allForThisEosId = asaContext.PointsSyncQueue
                    .Where(r => r.EosId == row.EosId);

                asaContext.PointsSyncQueue.RemoveRange(allForThisEosId);

                Console.WriteLine($"✅ Synced EosId {row.EosId} → Points: {row.Points} (cleared queue rows)");
            }

            await asaContext.SaveChangesAsync();
        }

        private async Task SyncASEAsync()
        {
            var connString = _connectionService.GetConnectionString("ArkShop");
            var optionsBuilder = new DbContextOptionsBuilder<ArkShopDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var aseContext = new ArkShopDbContext(optionsBuilder.Options);

            var steamMembers = await _mainDbContext.ZLGMembers
                .Where(m => m.SteamId != null)
                .ToListAsync();

            foreach (var member in steamMembers)
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
