using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Models;

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
            Console.WriteLine("🔑 Steam API Key requested.");
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

            zlgMember.SteamId = steamData.SteamId;
            zlgMember.SteamName = steamData.SteamName;
            zlgMember.SteamImgUrl = steamData.SteamImgUrl;

            await _dbContext.SaveChangesAsync();

            if (!zlgMember.ASELinked && !string.IsNullOrEmpty(zlgMember.SteamId))
            {
                if (ulong.TryParse(zlgMember.SteamId, out var steamIdAsUlong))
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

            return Ok("Steam account linked successfully.");
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

            zlgMember.SteamId = null;
            zlgMember.SteamName = null;
            zlgMember.SteamImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Steam account unlinked successfully.");
        }
    }
}
