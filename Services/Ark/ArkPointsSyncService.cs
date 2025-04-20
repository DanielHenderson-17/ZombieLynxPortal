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
                    // Console.WriteLine($"⚠️ No matching ZLGMember for SteamId: {row.SteamId}");
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


            await _mainDbContext.SaveChangesAsync();
            await arkContext.SaveChangesAsync();

            Console.WriteLine("💾 Sync complete and changes saved.");
        }

    }
}
