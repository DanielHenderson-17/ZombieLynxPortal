using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Services.Tebex
{
    public class TebexOrderProcessor
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public TebexOrderProcessor(ZombieLynxPortalAPIDbContext dbContext)
        {
            _dbContext = dbContext;
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

            Console.WriteLine($"🧩 Parsed group: {group ?? "(none)"}");
            Console.WriteLine($"🪙 Parsed points: {points}");

            var member = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == dto.UserProfileId);

            if (member == null)
            {
                Console.WriteLine($"❌ No ZLGMember found for UserProfileId: {dto.UserProfileId}");
                return;
            }
            if (!string.IsNullOrWhiteSpace(group))
            {
                var expiration = DateTime.UtcNow.AddDays(30).ToString("yyyy-MM-dd");
                member.TimedPermissionGroups = $"{group}:{expiration}";
                Console.WriteLine($"✅ Applied timed permission group: {group} (expires {expiration})");
            }


            if (points > 0)
            {
                member.Points += points;
                Console.WriteLine($"✅ Added {points} points. New total: {member.Points}");
            }

            await _dbContext.SaveChangesAsync();
            Console.WriteLine("💾 Changes saved to ZLGMember.");
        }
    }
}
