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
    public class MicrosoftController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public MicrosoftController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // ✅ Ping API to verify the controller is reachable
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("MicrosoftController is active.");

        // ✅ Retrieve Microsoft Client ID (needed for authentication flow)
        [HttpGet("get-api-key")]
        public IActionResult GetMicrosoftClientId()
        {
            Console.WriteLine("🔑 Microsoft Client ID requested.");
            var clientId = _configuration["MicrosoftAuth:ClientId"];

            if (string.IsNullOrEmpty(clientId))
            {
                return BadRequest("Microsoft Client ID is not configured.");
            }

            return Ok(new { clientId });
        }

        // ✅ Check if the user has a linked Microsoft account
        [HttpGet("linked")]
        public async Task<IActionResult> GetLinkedMicrosoftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.MicrosoftId))
                return Ok(new
                {
                    Message = "No Microsoft account linked.",
                    IsLinked = false
                });

            return Ok(new
            {
                zlgMember.MicrosoftId,
                zlgMember.MicrosoftName,
                zlgMember.MicrosoftImgUrl
            });
        }

        // ✅ Link a Microsoft account (used for Minecraft authentication)
        [HttpPut("link-microsoft")]
        public async Task<IActionResult> LinkMicrosoftAccount([FromBody] ZLGMemberDTO microsoftData)
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

            zlgMember.MicrosoftId = microsoftData.MicrosoftId;
            zlgMember.MicrosoftName = microsoftData.MicrosoftName;
            zlgMember.MicrosoftImgUrl = microsoftData.MicrosoftImgUrl;

            await _dbContext.SaveChangesAsync();

            return Ok("Microsoft account linked successfully.");
        }

        // ✅ Unlink a Microsoft account
        [HttpPut("unlink-microsoft")]
        public async Task<IActionResult> UnlinkMicrosoftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null)
                return NotFound("User profile not found.");

            // Remove Microsoft account details
            zlgMember.MicrosoftId = null;
            zlgMember.MicrosoftName = null;
            zlgMember.MicrosoftImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Microsoft account unlinked successfully.");
        }
    }
}
