using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Services;
using Serilog;

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
            await SyncMinecraftAsync();
            await SyncASEAsync();
            await SyncASAAsync();

            await _mainDbContext.SaveChangesAsync();
        }

        private async Task SyncMinecraftAsync()
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

            foreach (var row in pendingRows)
            {
                var member = await _mainDbContext.ZLGMembers
                    .FirstOrDefaultAsync(m => m.MinecraftUuid == row.Uuid);

                if (member == null)
                    continue;

                member.Points = row.Points;

                var allForThisUuid = mcContext.PointsSyncQueue
                    .Where(r => r.Uuid == row.Uuid);

                mcContext.PointsSyncQueue.RemoveRange(allForThisUuid);

            }

            await mcContext.SaveChangesAsync();
        }

        private async Task SyncASEAsync()
        {
            var aseConnString = _connectionService.GetConnectionString("ArkShop");
            var aseOptionsBuilder = new DbContextOptionsBuilder<ArkShopDbContext>();
            aseOptionsBuilder.UseMySQL(aseConnString);

            using var aseContext = new ArkShopDbContext(aseOptionsBuilder.Options);

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

        private async Task SyncASAAsync()
        {
            var asaConnString = _connectionService.GetConnectionString("AsaShop");
            var asaOptionsBuilder = new DbContextOptionsBuilder<AsaShopDbContext>();
            asaOptionsBuilder.UseMySQL(asaConnString);

            using var asaContext = new AsaShopDbContext(asaOptionsBuilder.Options);

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
                }
            }

            await asaContext.SaveChangesAsync();

        }
    }
}
