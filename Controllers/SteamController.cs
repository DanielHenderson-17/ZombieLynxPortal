using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Models;
using Serilog;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class SteamController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ArkLinkPointsDbContext _arkLinkPointsDbContext;


        public SteamController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration, ArkLinkPointsDbContext arkLinkPointsDbContext)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _arkLinkPointsDbContext = arkLinkPointsDbContext;
        }

        // Ping API
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("SteamAuthController is active.");

        // ✅ Secure endpoint to retrieve the Steam API Key
        [HttpGet("get-api-key")]
        public IActionResult GetSteamApiKey()
        {
            Log.Information("🔑 Steam API Key requested.");
            var steamApiKey = _configuration["SteamApiKey:ApiKey"];
            return Ok(new { apiKey = steamApiKey });
        }

        // GET: api/Steam/linked
        [HttpGet("linked")]
        public async Task<IActionResult> GetLinkedSteamAccount()
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.SteamId))
                return Ok(new
                {
                    Message = "No Steam account linked.",
                    IsLinked = false
                });

            return Ok(new
            {
                zlgMember.SteamId,
                zlgMember.SteamName,
                zlgMember.SteamImgUrl
            });
        }

        // PUT: api/Steam/link-steam
        [HttpPut("link-steam")]
        public async Task<IActionResult> LinkSteamAccount([FromBody] ZLGMemberDTO steamData)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            // Check if this Steam ID is already linked to another user
            var incomingSteamId = steamData.SteamId?.Trim();
            var existingLink = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.SteamId == incomingSteamId);

            if (existingLink != null && existingLink.UserProfileId != userProfile.Id)
            {
                return Conflict("This Steam account is already linked to another user.");
            }

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == userProfile.Id);

            if (zlgMember == null)
            {
                zlgMember = new ZLGMember
                {
                    UserProfileId = userProfile.Id
                };
                _dbContext.ZLGMembers.Add(zlgMember);
            }

            zlgMember.SteamId = incomingSteamId;
            zlgMember.SteamName = steamData.SteamName;
            zlgMember.SteamImgUrl = steamData.SteamImgUrl;

            await _dbContext.SaveChangesAsync();

            if (!zlgMember.ASELinked && !string.IsNullOrEmpty(zlgMember.SteamId))
            {
                var previouslyLinked = await _dbContext.PreviouslyLinkedAccounts
                    .AsNoTracking()
                    .AnyAsync(p =>
                        p.Platform == "Steam" &&
                        p.ExternalId == zlgMember.SteamId
                    );

                if (!previouslyLinked && ulong.TryParse(zlgMember.SteamId, out var steamIdAsUlong))
                {
                    var arkPlayer = await _arkLinkPointsDbContext.ArkShopPlayers
                        .FirstOrDefaultAsync(p => p.SteamId == steamIdAsUlong);

                    if (arkPlayer != null)
                    {
                        zlgMember.Points += arkPlayer.Points;
                    }
                }
                zlgMember.ASELinked = true;
            }
            await _dbContext.SaveChangesAsync();

            return Ok("Steam account linked successfully.");
        }

        [HttpGet("check-steam/{steamId}")]
        public async Task<IActionResult> CheckSteamLinked(string steamId)
        {
            var exists = await _dbContext.ZLGMembers
                .AsNoTracking()
                .AnyAsync(m => m.SteamId == steamId);

            return Ok(new { isLinked = exists });
        }


        // PUT: api/Steam/unlink-steam
        [HttpPut("unlink-steam")]
        public async Task<IActionResult> UnlinkSteamAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null)
                return NotFound("User profile not found.");

            if (!string.IsNullOrEmpty(zlgMember.SteamId))
            {
                var existingRecord = await _dbContext.PreviouslyLinkedAccounts
                    .FirstOrDefaultAsync(p =>
                        p.Platform == "Steam" &&
                        p.ExternalId == zlgMember.SteamId
                    );

                if (existingRecord != null)
                {
                    // ✅ Update existing
                    existingRecord.UnlinkedAt = DateTime.UtcNow;
                    _dbContext.PreviouslyLinkedAccounts.Update(existingRecord);
                }
                else
                {
                    // ✅ Add new
                    var record = new PreviouslyLinkedAccount
                    {
                        Platform = "Steam",
                        ExternalId = zlgMember.SteamId,
                        UnlinkedAt = DateTime.UtcNow
                    };
                    _dbContext.PreviouslyLinkedAccounts.Add(record);
                }
            }

            zlgMember.SteamId = null;
            zlgMember.SteamName = null;
            zlgMember.SteamImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Steam account unlinked and recorded.");
        }

    }
}
