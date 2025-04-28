using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models.Minecraft;

namespace ZombieLynxPortalAPI.Services.Minecraft
{
    public class MinecraftSubscriptionSyncService
    {
        private readonly ZombieLynxPortalAPIDbContext _mainDbContext;
        private readonly PointsDbConnectionService _connectionService;

        public MinecraftSubscriptionSyncService(ZombieLynxPortalAPIDbContext mainDbContext, PointsDbConnectionService connectionService)
        {
            _mainDbContext = mainDbContext;
            _connectionService = connectionService;
        }

        public async Task ApplyTimedSubscriptionAsync(int userProfileId, string group, DateTime expiresUtc)
        {
            var member = await _mainDbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == userProfileId);

            if (member == null || string.IsNullOrWhiteSpace(member.MinecraftUuid))
            {
                Console.WriteLine($"❌ Cannot sync subscription – member not found or missing MinecraftUuid.");
                return;
            }

            var connString = _connectionService.GetConnectionString("MinecraftPermissions");
            var optionsBuilder = new DbContextOptionsBuilder<MinecraftPermissionsDbContext>();
            optionsBuilder.UseMySQL(connString);

            using var mcPermsContext = new MinecraftPermissionsDbContext(optionsBuilder.Options);

            var expirationEpoch = ((DateTimeOffset)expiresUtc).ToUnixTimeSeconds();
            var lowercaseGroup = group.ToLower();

            var uuid = member.MinecraftUuid.Trim().ToLower();
            var permissionKey = lowercaseGroup.Trim();

            var permission = await mcPermsContext.Permissions
                .FirstOrDefaultAsync(p =>
                    EF.Functions.Like(p.Uuid, uuid) &&
                    EF.Functions.Like(p.Permission, permissionKey) &&
                    p.Server == "global" &&
                    p.World == "global");


            if (permission != null)
            {
                permission.Expiry = expirationEpoch;
                Console.WriteLine($"🔁 Updated Minecraft permission {lowercaseGroup} for UUID {member.MinecraftUuid}.");
            }
            else
            {
                mcPermsContext.Permissions.Add(new MinecraftPermissionPlayer
                {
                    Uuid = member.MinecraftUuid,
                    Permission = lowercaseGroup,
                    Value = true,
                    Server = "global",
                    World = "global",
                    Expiry = expirationEpoch,
                    Contexts = ""
                });
                Console.WriteLine($"➕ Added new Minecraft permission {lowercaseGroup} for UUID {member.MinecraftUuid}.");
            }

            await mcPermsContext.SaveChangesAsync();
            Console.WriteLine($"✅ Synced Minecraft timed sub: UUID {member.MinecraftUuid} → {lowercaseGroup} (expires {expirationEpoch})");
        }
    }
}
