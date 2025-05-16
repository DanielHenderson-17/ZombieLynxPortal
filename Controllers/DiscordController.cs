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
    public class DiscordController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public DiscordController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // ✅ Ping API to verify the controller is reachable
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("DiscordController is active.");


        [HttpGet("get-api-key")]
        public IActionResult GetDiscordApiKey()
        {
            Log.Information("🔑 Discord Client ID requested.");
            var discordClientId = _configuration["DiscordApiKey:ClientId"];

            if (string.IsNullOrEmpty(discordClientId))
            {
                return BadRequest("Discord Client ID is not configured.");
            }

            return Ok(new { clientId = discordClientId });
        }

        [HttpGet("linked")]
        public async Task<IActionResult> GetLinkedDiscordAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.DiscordId))
                return Ok(new
                {
                    Message = "No Discord account linked.",
                    IsLinked = false
                });

            return Ok(new
            {
                zlgMember.DiscordId,
                zlgMember.DiscordName,
                zlgMember.DiscordImgUrl
            });
        }

        // GET: api/Discord/is-linked/{discordId}
        [HttpGet("is-linked/{discordId}")]
        public async Task<IActionResult> IsDiscordIdLinked(string discordId)
        {
            var exists = await _dbContext.ZLGMembers
                .AsNoTracking()
                .AnyAsync(m => m.DiscordId == discordId);

            return Ok(new { isLinked = exists });
        }


        // PUT: api/Discord/link-discord
        [HttpPut("link-discord")]
        public async Task<IActionResult> LinkDiscordAccount([FromBody] ZLGMemberDTO discordData)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            // Check if this Discord ID is already linked to another user
            var incomingDiscordId = discordData.DiscordId?.Trim();
            var existingLink = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.DiscordId == incomingDiscordId);


            if (existingLink != null && existingLink.UserProfileId != userProfile.Id)
            {
                return Conflict("This Discord account is already linked to another user.");
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

            zlgMember.DiscordId = incomingDiscordId;
            zlgMember.DiscordName = discordData.DiscordName;
            zlgMember.DiscordImgUrl = discordData.DiscordImgUrl;

            await _dbContext.SaveChangesAsync();

            return Ok("Discord account linked successfully.");
        }

        // PUT: api/Discord/unlink-discord
        [HttpPut("unlink-discord")]
        public async Task<IActionResult> UnlinkDiscordAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null)
                return NotFound("User profile not found.");

            // Remove Discord account details
            zlgMember.DiscordId = null;
            zlgMember.DiscordName = null;
            zlgMember.DiscordImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Discord account unlinked successfully.");
        }

    }
}
