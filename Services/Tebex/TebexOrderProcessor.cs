using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Services.Ark;
using ZombieLynxPortalAPI.Services.Minecraft;
using ZombieLynxPortalAPI.Models;
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

            // Check for bp-level first
            if (parts.Length == 2 && parts[0].ToLower() == "bp-level")
            {
                if (int.TryParse(parts[1], out int xp))
                {
                    Log.Information($"🧬 Detected BP-Level purchase. Granting {xp} XP to user {dto.UserProfileId}");

                    var userProfile = await _dbContext.UserProfiles
                        .AsNoTracking()
                        .FirstOrDefaultAsync(p => p.Id == dto.UserProfileId);

                    if (userProfile == null)
                    {
                        Log.Warning("❌ User profile not found. Skipping XP grant.");
                        return;
                    }

                    var zlgMember = await _dbContext.ZLGMembers
                        .FirstOrDefaultAsync(z => z.UserProfileId == dto.UserProfileId);

                    if (zlgMember == null)
                    {
                        Log.Warning("❌ ZLG member not found. Skipping XP grant.");
                        return;
                    }

                    var progress = await _dbContext.BattlePassProgress
                        .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);

                    if (progress == null)
                    {
                        progress = new BattlePassProgress

                        {
                            ZLGMemberId = zlgMember.Id,
                            XP = xp,
                            LastXPUpdate = DateTime.UtcNow
                        };
                        _dbContext.BattlePassProgress.Add(progress);
                        Log.Information("🆕 Created new BattlePassProgress entry.");
                    }
                    else
                    {
                        progress.XP += xp;
                        progress.LastXPUpdate = DateTime.UtcNow;
                        _dbContext.BattlePassProgress.Update(progress);
                        Log.Information($"📈 Updated BattlePassProgress. New XP: {progress.XP}");
                    }

                    await _dbContext.SaveChangesAsync();
                    Log.Information("💾 Battle pass XP changes saved.");
                    return; // ✅ Done, skip normal point/subscription flow
                }
                else
                {
                    Log.Warning("❌ Invalid XP value passed for bp-level.");
                    return;
                }
            }

            // Normal points/subscription flow
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
