using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using Serilog;

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
                }
            }

            await aseContext.SaveChangesAsync();
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
                }
            }

            await mcContext.SaveChangesAsync();
        }
    }
}
