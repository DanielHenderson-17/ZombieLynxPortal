using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Data;
using Serilog;

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
                return;
            }

            if (!ulong.TryParse(member.SteamId, out var steamId))
            {
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
                return;
            }

            player.TimedPermissionGroups = formatted;
            await arkPermsContext.SaveChangesAsync();
        }
    }
}
