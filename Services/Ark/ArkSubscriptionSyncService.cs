using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Data;

namespace ZombieLynxPortalAPI.Services.Ark
{
    public class ArkSubscriptionSyncService
    {
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;
        private readonly PointsDbConnectionService _connectionService;

        public ArkSubscriptionSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task ApplyTimedSubscriptionAsync(int userProfileId, string group, DateTime expiresUtc)
        {
            var member = await _mainDbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == userProfileId);

            if (member == null || string.IsNullOrWhiteSpace(member.SteamId))
            {
                Console.WriteLine($"❌ Cannot sync subscription – member not found or missing SteamId.");
                return;
            }

            if (!ulong.TryParse(member.SteamId, out var steamId))
            {
                Console.WriteLine($"❌ Invalid SteamId format: {member.SteamId}");
                return;
            }

            var expirationEpoch = ((DateTimeOffset)DateTime.UtcNow.AddDays(30)).ToUnixTimeSeconds();
            var formatted = $"0;{expirationEpoch};{group},";

            var connString = _connectionService.GetConnectionString("ArkPermissions");
            var optionsBuilder = new DbContextOptionsBuilder<ArkPermissionsDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var arkPermsContext = new ArkPermissionsDbContext(optionsBuilder.Options);
            var player = await arkPermsContext.Players
                .FirstOrDefaultAsync(p => p.SteamId == steamId);

            if (player == null)
            {
                Console.WriteLine($"⚠️ No ArkPermissions player found for SteamId: {steamId}");
                return;
            }

            player.TimedPermissionGroups = formatted;
            await arkPermsContext.SaveChangesAsync();

            Console.WriteLine($"✅ Synced Ark timed sub: SteamId {steamId} → {formatted}");
        }
    }
}
