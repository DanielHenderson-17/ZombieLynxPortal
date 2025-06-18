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
        [HttpGet("pvp-summary")]
        [Authorize]
        public async Task<IActionResult> GetPVPSummary()
        {
            var allStats = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .ToListAsync();

            if (allStats.Count == 0)
                return Ok(new { message = "No PVP data available." });

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

            // Pre-sorted lists for percentile calculation
            var killsSorted = allStats.Select(s => s.PlayerKills).OrderBy(x => x).ToList();
            var deathsSorted = allStats.Select(s => s.PlayerDeaths).OrderBy(x => x).ToList();
            var kdSorted = allStats.Select(s => s.KD).OrderBy(x => x).ToList();
            var damageSorted = allStats.Select(s => s.PvPDamage).OrderBy(x => x).ToList();

            int Percentile<T>(List<T> sortedList, T value) where T : IComparable<T>
            {
                int index = sortedList.FindLastIndex(v => v.CompareTo(value) <= 0);
                return (int)((index + 1) / (double)sortedList.Count * 100);
            }

            // Get a Top Player with highest value in any tracked stat
            var topPlayer = allStats
                .OrderByDescending(s =>
                    Math.Max(
                        Math.Max(s.PlayerKills, s.PlayerDeaths),
                        Math.Max(s.KD, s.PvPDamage)
                    )
                )
                .FirstOrDefault();

            var result = new
            {
                PlayerKills = new
                {
                    min = killsSorted.First(),
                    max = killsSorted.Last(),
                    avg = Math.Round(killsSorted.Average(), 2),
                    percentileRank = Percentile(killsSorted, myStats.PlayerKills)
                },
                PlayerDeaths = new
                {
                    min = deathsSorted.First(),
                    max = deathsSorted.Last(),
                    avg = Math.Round(deathsSorted.Average(), 2),
                    percentileRank = Percentile(deathsSorted, myStats.PlayerDeaths)
                },
                KD = new
                {
                    min = kdSorted.First(),
                    max = kdSorted.Last(),
                    avg = Math.Round(kdSorted.Average(), 2),
                    percentileRank = Percentile(kdSorted, myStats.KD)
                },
                PvPDamage = new
                {
                    min = damageSorted.First(),
                    max = damageSorted.Last(),
                    avg = Math.Round(damageSorted.Average(), 2),
                    percentileRank = Percentile(damageSorted, myStats.PvPDamage)
                },
                TopPlayer = topPlayer == null ? null : new
                {
                    topPlayer.PlayerKills,
                    topPlayer.PlayerDeaths,
                    topPlayer.KD,
                    topPlayer.PvPDamage
                }
            };

            return Ok(result);
        }
        [HttpGet("pvp-top-ten")]
        [Authorize]
        public async Task<IActionResult> GetTopTenPlayers()
        {
            var topStats = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .OrderByDescending(s => s.PlayerKills)
                .Take(10)
                .ToListAsync();

            if (!topStats.Any())
                return Ok(new { message = "No PvP data found." });

            var steamIds = topStats.Select(s => s.SteamId).ToList();

            var zlgMembers = await _mainDb.ZLGMembers
                .AsNoTracking()
                .Where(m => steamIds.Contains(m.SteamId))
                .ToDictionaryAsync(m => m.SteamId!);

            var result = topStats.Select(stat =>
            {
                zlgMembers.TryGetValue(stat.SteamId, out var member);

                return new
                {
                    Name = member?.DiscordName ?? stat.Name,
                    stat.PlayerKills,
                    stat.PlayerDeaths,
                    stat.PvPDamage,
                    KD = Math.Round(stat.KD, 2),
                    DiscordName = member?.DiscordName,
                    DiscordImgUrl = member?.DiscordImgUrl
                };
            });

            return Ok(result);
        }

        [HttpGet("tribe")]
        [Authorize]
        public async Task<IActionResult> GetTribeStats()
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
                return NotFound("No linked Steam ID found.");

            var player = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SteamId == zlgMember.SteamId);

            if (player == null || string.IsNullOrWhiteSpace(player.TribeName))
                return NotFound("Your Ark stats or tribe name was not found.");

            var tribeMembers = await _arkStatsDb.ArkStats
                .AsNoTracking()
                .Where(s => s.TribeName == player.TribeName)
                .OrderByDescending(s => s.PlayerKills)
                .ToListAsync();

            var steamIds = tribeMembers.Select(s => s.SteamId).ToList();

            var zlgMembers = await _mainDb.ZLGMembers
                .AsNoTracking()
                .Where(m => steamIds.Contains(m.SteamId))
                .ToDictionaryAsync(m => m.SteamId!);

            var result = tribeMembers.Select(m =>
            {
                zlgMembers.TryGetValue(m.SteamId, out var member);
                return new
                {
                    m.Name,
                    m.PlayerKills,
                    m.PlayerDeaths,
                    m.KD,
                    m.PvPDamage,
                    member?.DiscordName,
                    member?.DiscordImgUrl
                };
            });

            return Ok(new
            {
                player.TribeName,
                Members = result
            });
        }
    }
}
