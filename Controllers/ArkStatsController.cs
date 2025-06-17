using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArkStatsController : ControllerBase
    {
        private readonly ArkStatsDbContext _arkStatsDb;
        private readonly ZombieLynxPortalAPIDbContext _mainDb;

        public ArkStatsController(
            ArkStatsDbContext arkStatsDb,
            ZombieLynxPortalAPIDbContext mainDb)
        {
            _arkStatsDb = arkStatsDb;
            _mainDb = mainDb;
        }

        // ✅ GET by userProfileId
        [HttpGet("by-user/{userProfileId:int}")]
        [Authorize]
        public async Task<IActionResult> GetStatsByUserProfileId(int userProfileId)
        {
            var zlgMember = await _mainDb.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfileId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.SteamId))
                return NotFound("No linked Steam account found for this user.");

            var stats = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SteamId == zlgMember.SteamId);

            if (stats == null)
                return NotFound("No Ark stats found for this Steam ID.");

            return Ok(stats);
        }

        // ✅ GET for currently logged-in user
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var parsedGuid))

                return Unauthorized("Invalid or missing user ID in token.");

            var userProfile = await _mainDb.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(up => up.UserId == parsedGuid);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.SteamId))
                return NotFound("No linked Steam account found.");

            var stats = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SteamId == zlgMember.SteamId);

            if (stats == null)
                return NotFound("No Ark stats found for this Steam ID.");

            return Ok(stats);
        }

        // GET: /api/ArkStats/kd-summary
        [HttpGet("kd-summary")]
        [Authorize]
        public async Task<IActionResult> GetKDStats()
        {
            var allKDs = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .Where(s => s.KD >= 0)
                .Select(s => s.KD)
                .ToListAsync();

            if (allKDs.Count == 0)
                return Ok(new { message = "No K/D data available." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var guid))
                return Unauthorized("Missing or invalid token.");

            var userProfile = await _mainDb.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == guid);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.SteamId))
                return NotFound("No Steam ID linked.");

            var myStats = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SteamId == zlgMember.SteamId);

            if (myStats == null)
                return NotFound("No Ark stats found for you.");

            var myKD = myStats.KD;

            var sorted = allKDs.OrderBy(k => k).ToList();

            if (sorted.All(k => k == 0))
            {
                return Ok(new
                {
                    myKD,
                    minKD = 0,
                    maxKD = 0,
                    averageKD = 0,
                    percentileRank = 0
                });
            }

            var index = sorted.FindLastIndex(k => k <= myKD);
            var percentile = (int)((index + 1) / (double)sorted.Count * 100);

            return Ok(new
            {
                myKD = Math.Round(myKD, 2),
                minKD = Math.Round(sorted.First(), 2),
                maxKD = Math.Round(sorted.Last(), 2),
                averageKD = Math.Round(sorted.Average(), 2),
                percentileRank = percentile
            });
        }

    }
}
