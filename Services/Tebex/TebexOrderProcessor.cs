using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Services.Ark;
using ZombieLynxPortalAPI.Services.Minecraft;
using Serilog;

namespace ZombieLynxPortalAPI.Services.Tebex
{
    public class TebexOrderProcessor
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly ArkSubscriptionSyncService _arkSubSync;
        private readonly AsaSubscriptionSyncService _asaSubSync;
        private readonly MinecraftSubscriptionSyncService _minecraftSubSync;

        public TebexOrderProcessor(
            ZombieLynxPortalAPIDbContext dbContext,
            ArkSubscriptionSyncService arkSubSync,
            AsaSubscriptionSyncService asaSubSync,
            MinecraftSubscriptionSyncService minecraftSubSync)
        {
            _dbContext = dbContext;
            _arkSubSync = arkSubSync;
            _asaSubSync = asaSubSync;
            _minecraftSubSync = minecraftSubSync;
        }

        public async Task ProcessOrderAsync(TebexOrderActionDTO dto)
        {
            string[] parts = dto.Custom.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            string? group = null;
            int points = 0;

            if (parts.Length == 1)
            {
                if (int.TryParse(parts[0], out var parsedPoints))
                {
                    points = parsedPoints;
                }
                else
                {
                    group = parts[0];
                }
            }
            else if (parts.Length == 2)
            {
                group = parts[0];

                if (int.TryParse(parts[1], out var parsedPoints))
                {
                    points = parsedPoints;
                }
            }

            Log.Information($"🧩 Parsed group: {group ?? "(none)"}");
            Log.Information($"🪙 Parsed points: {points}");

            var member = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == dto.UserProfileId);

            if (member == null)
            {
                Log.Information($"❌ No ZLGMember found for UserProfileId: {dto.UserProfileId}");
                return;
            }

            if (!string.IsNullOrWhiteSpace(group))
            {
                var expiration = DateTime.UtcNow.AddDays(30).ToString("yyyy-MM-dd");
                member.TimedPermissionGroups = $"{group}:{expiration}";
                Log.Information($"✅ Applied timed permission group: {group} (expires {expiration})");

                await _arkSubSync.ApplyTimedSubscriptionAsync(dto.UserProfileId, group, DateTime.UtcNow.AddDays(30));
                await _asaSubSync.ApplyTimedSubscriptionAsync(dto.UserProfileId, group, DateTime.UtcNow.AddDays(30));
                await _minecraftSubSync.ApplyTimedSubscriptionAsync(dto.UserProfileId, group, DateTime.UtcNow.AddDays(30));
            }

            if (points > 0)
            {
                var originalPoints = member.Points;
                var addedPoints = points;
                member.Points = originalPoints + addedPoints;

                Log.Information($"💰 Adding Tebex points: {originalPoints} + {addedPoints} = {member.Points} for user {member.UserProfileId}");
            }


            await _dbContext.SaveChangesAsync();
            Log.Information("💾 Changes saved to ZLGMember.");
        }
    }
}
