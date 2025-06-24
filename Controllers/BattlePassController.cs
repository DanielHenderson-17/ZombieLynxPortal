using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZombieLynxPortalAPI.Models.BattlePass.Config;
using ZombieLynxPortalAPI.Services.BattlePass;
using ZombieLynxPortalAPI.Data;
using System.Security.Claims;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Models.BattlePass.DTO;



namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BattlePassController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _mainDb;

        public BattlePassController(ZombieLynxPortalAPIDbContext mainDb)
        {
            _mainDb = mainDb;
        }

        // ✅ Simple test route
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "Battle pass endpoint is alive." });
        }

        // ✅ Returns active battle pass season and rewards
        [HttpGet]
        public IActionResult GetActiveBattlePass()
        {
            try
            {
                var config = BattlePassConfigLoader.LoadConfig();
                if (!config.BattlePasses.TryGetValue(config.ActiveBp, out var activeSeason))
                    return NotFound("Active battle pass not found.");

                return Ok(new
                {
                    name = activeSeason.Name,
                    img = activeSeason.Img,
                    start = activeSeason.Start,
                    end = activeSeason.End,
                    xpPerLevel = config.XpPerLevel,
                    dailyXpCap = config.DailyXpCap,
                    premium = config.Premium,
                    rewards = activeSeason.Rewards
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to load battle pass config: {ex.Message}");
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyBattlePass()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var guid))
                return Unauthorized("Invalid or missing user ID in token.");

            var userProfile = await _mainDb.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == guid);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);

            if (zlgMember == null)
                return NotFound("No ZLG member record found.");

            var progress = await _mainDb.BattlePassProgress
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);

            var claims = await _mainDb.BattlePassClaims
                .AsNoTracking()
                .Where(c => c.ZLGMemberId == zlgMember.Id)
                .Select(c => c.LevelNumber)
                .ToListAsync();

            var config = BattlePassConfigLoader.LoadConfig();
            if (!config.BattlePasses.TryGetValue(config.ActiveBp, out var activeSeason))
                return NotFound("Active battle pass config not found.");

            var xp = progress?.XP ?? 0;
            var xpPerLevel = config.XpPerLevel;

            var claimableLevels = activeSeason.Rewards
                .Where(r =>
                    (r.Key * xpPerLevel) <= xp &&
                    (!r.Value.Premium || progress?.HasPremium == true) &&
                    !claims.Contains(r.Key)
                )
                .Select(r => r.Key)
                .ToList();

            return Ok(new
            {
                name = activeSeason.Name,
                end = activeSeason.End,
                xp,
                hasPremium = progress?.HasPremium ?? false,
                premiumPurchasedAt = progress?.PremiumPurchasedAt,
                claimedLevels = claims,
                claimableLevels,
                rewards = activeSeason.Rewards,
                img = activeSeason.Img
            });
        }

        [HttpPost("add-xp")]
        [AllowAnonymous]
        public async Task<IActionResult> AddXpToUser([FromBody] AddXpDTO dto)
        {
            if (dto.XP <= 0)
                return BadRequest("XP amount must be greater than zero.");

            var userProfile = await _mainDb.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == dto.UserProfileId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .FirstOrDefaultAsync(z => z.UserProfileId == dto.UserProfileId);

            if (zlgMember == null)
                return NotFound("ZLG member not found.");

            var progress = await _mainDb.BattlePassProgress
                .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);

            if (progress == null)
            {
                progress = new BattlePassProgress
                {
                    ZLGMemberId = zlgMember.Id,
                    XP = dto.XP,
                    LastXPUpdate = DateTime.UtcNow
                };
                _mainDb.BattlePassProgress.Add(progress);
            }
            else
            {
                progress.XP += dto.XP;
                progress.LastXPUpdate = DateTime.UtcNow;
                _mainDb.BattlePassProgress.Update(progress);
            }

            await _mainDb.SaveChangesAsync();

            return Ok(new
            {
                message = "XP added successfully.",
                newXP = progress.XP
            });
        }
        [HttpPost("add-premium")]
        [AllowAnonymous]
        public async Task<IActionResult> AddPremiumToUser([FromBody] AddPremiumDTO dto)
        {
            var userProfile = await _mainDb.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == dto.UserProfileId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .FirstOrDefaultAsync(z => z.UserProfileId == dto.UserProfileId);

            if (zlgMember == null)
                return NotFound("ZLG member not found.");

            var config = BattlePassConfigLoader.LoadConfig();
            int bonusXp = config.Premium.BonusXp;

            var progress = await _mainDb.BattlePassProgress
                .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);

            if (progress == null)
            {
                progress = new BattlePassProgress
                {
                    ZLGMemberId = zlgMember.Id,
                    HasPremium = true,
                    PremiumPurchasedAt = DateTime.UtcNow,
                    XP = bonusXp,
                    LastXPUpdate = DateTime.UtcNow
                };
                _mainDb.BattlePassProgress.Add(progress);
            }
            else
            {
                progress.HasPremium = true;
                progress.PremiumPurchasedAt = DateTime.UtcNow;
                progress.XP += bonusXp;
                progress.LastXPUpdate = DateTime.UtcNow;
                _mainDb.BattlePassProgress.Update(progress);
            }

            await _mainDb.SaveChangesAsync();

            return Ok(new
            {
                message = "Premium activated and bonus XP granted.",
                hasPremium = true,
                premiumPurchasedAt = progress.PremiumPurchasedAt,
                totalXP = progress.XP
            });
        }
        [HttpPost("claim/{level}")]
        [Authorize]
        public async Task<IActionResult> ClaimLevel(int level)
        {
            if (level <= 0)
                return BadRequest("Invalid level number.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var guid))
                return Unauthorized("Invalid or missing user ID in token.");

            var userProfile = await _mainDb.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == guid);
            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);
            if (zlgMember == null)
                return NotFound("ZLG member not found.");

            var progress = await _mainDb.BattlePassProgress
                .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);
            if (progress == null)
                return NotFound("Battle pass progress not found.");

            var config = BattlePassConfigLoader.LoadConfig();
            if (!config.BattlePasses.TryGetValue(config.ActiveBp, out var activeSeason))
                return NotFound("Active battle pass config not found.");

            if (!activeSeason.Rewards.TryGetValue(level, out var reward))
                return BadRequest("Invalid level. No reward exists for this level.");

            int currentXP = progress.XP;
            int xpPerLevel = config.XpPerLevel;
            int requiredXP = level * xpPerLevel;

            if (currentXP < requiredXP)
                return BadRequest("You have not reached the required XP to claim this reward.");

            bool alreadyClaimed = await _mainDb.BattlePassClaims
                .AnyAsync(c => c.ZLGMemberId == zlgMember.Id && c.LevelNumber == level);

            if (alreadyClaimed)
                return BadRequest("Reward for this level has already been claimed.");

            _mainDb.BattlePassClaims.Add(new BattlePassClaim
            {
                ZLGMemberId = zlgMember.Id,
                LevelNumber = level,
                ClaimedAt = DateTime.UtcNow
            });

            await _mainDb.SaveChangesAsync();

            return Ok(new
            {
                message = $"Reward for level {level} successfully claimed."
            });
        }


        [HttpPost("claim-all")]
        [Authorize]
        public async Task<IActionResult> ClaimAllAvailable()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var guid))
                return Unauthorized("Invalid or missing user ID in token.");

            var userProfile = await _mainDb.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == guid);
            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _mainDb.ZLGMembers
                .FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);
            if (zlgMember == null)
                return NotFound("ZLG member not found.");

            var progress = await _mainDb.BattlePassProgress
                .FirstOrDefaultAsync(p => p.ZLGMemberId == zlgMember.Id);
            if (progress == null)
                return NotFound("Battle pass progress not found.");

            var alreadyClaimed = await _mainDb.BattlePassClaims
                .Where(c => c.ZLGMemberId == zlgMember.Id)
                .Select(c => c.LevelNumber)
                .ToListAsync();

            var config = BattlePassConfigLoader.LoadConfig();
            if (!config.BattlePasses.TryGetValue(config.ActiveBp, out var activeSeason))
                return NotFound("Active battle pass config not found.");

            var claimable = activeSeason.Rewards
                .Where(r => (r.Key * config.XpPerLevel) <= progress.XP && (!r.Value.Premium || progress.HasPremium) && !alreadyClaimed.Contains(r.Key))
                .Select(r => new BattlePassClaim
                {
                    ZLGMemberId = zlgMember.Id,
                    LevelNumber = r.Key,
                    ClaimedAt = DateTime.UtcNow
                })
                .ToList();

            if (!claimable.Any())
                return Ok(new { message = "No rewards available to claim." });

            _mainDb.BattlePassClaims.AddRange(claimable);
            await _mainDb.SaveChangesAsync();

            return Ok(new
            {
                message = $"Claimed {claimable.Count} rewards successfully.",
                claimedLevels = claimable.Select(c => c.LevelNumber).ToList()
            });
        }

    }
}
