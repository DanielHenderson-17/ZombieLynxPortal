using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Data;
using Serilog;

namespace ZombieLynxPortalAPI.Services.Ark
{
    public class AsaSubscriptionSyncService
    {
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;
        private readonly PointsDbConnectionService _connectionService;

        public AsaSubscriptionSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task ApplyTimedSubscriptionAsync(int userProfileId, string group, DateTime expiresUtc)
        {
            var member = await _mainDbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == userProfileId);

            if (member == null || string.IsNullOrWhiteSpace(member.EosId))
            {
                return;
            }

            var expirationEpoch = ((DateTimeOffset)DateTime.UtcNow.AddDays(30)).ToUnixTimeSeconds();
            var formatted = $"0;{expirationEpoch};{group},";

            var connString = _connectionService.GetConnectionString("AsaPermissions");
            var optionsBuilder = new DbContextOptionsBuilder<AsaPermissionsDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var asaPermsContext = new AsaPermissionsDbContext(optionsBuilder.Options);
            var player = await asaPermsContext.Players
                .FirstOrDefaultAsync(p => p.EosId == member.EosId);

            if (player == null)
            {
                return;
            }

            player.TimedPermissionGroups = formatted;
            await asaPermsContext.SaveChangesAsync();
        }
    }
}
