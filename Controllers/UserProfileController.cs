using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;
using Serilog;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserProfileController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _context;

        public UserProfileController(ZombieLynxPortalAPIDbContext context)
        {
            _context = context;
        }

        // 🔒 Get the current logged-in user's profile
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var profile = await _context.UserProfiles
                .Include(up => up.User)
                .Where(up => up.UserId.ToString() == userId)
                .Select(up => new UserProfileDTO
                {
                    Id = up.Id,
                    FirstName = up.FirstName,
                    LastName = up.LastName,
                    Email = up.User.Email,
                    Role = up.User.Role,
                    AllowMarketingEmails = up.AllowMarketingEmails
                })
                .FirstOrDefaultAsync();

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }

        // 🔒 Get all users (Admin only)
        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Profile)
                .Select(u => new
                {
                    u.Id,
                    Name = u.Profile != null ? $"{u.Profile.FirstName} {u.Profile.LastName}" : "No Name",
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }


        // 🔒 Get all user profiles with roles (Admin only)
        [HttpGet("withroles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserProfilesWithRoles()
        {
            var profiles = await _context.UserProfiles
                .Include(up => up.User)
                .Select(up => new UserProfileDTO
                {
                    Id = up.Id,
                    FirstName = up.FirstName,
                    LastName = up.LastName,
                    Email = up.User.Email,
                    Role = up.User.Role
                })
                .ToListAsync();

            return Ok(profiles);
        }

        // 🔼 Promote a user to Admin
        [HttpPost("promote/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PromoteUser(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            user.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok("User promoted to Admin.");
        }

        // 🔽 Demote a user to User
        [HttpPost("demote/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DemoteUser(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            user.Role = "User";
            await _context.SaveChangesAsync();

            return Ok("User demoted to User.");
        }

        [HttpGet("membership")]
        [Authorize]
        public async Task<IActionResult> GetMembershipDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var member = await _context.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId.ToString() == userId);

            if (member == null)
                return NotFound("Membership record not found.");

            return Ok(new
            {
                member.Points,
                Sub = member.TimedPermissionGroups
            });
        }

        [HttpPut("marketing-consent")]
        [Authorize]
        public async Task<IActionResult> UpdateMarketingConsent([FromBody] MarketingConsentDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var profile = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == userId);

            if (profile == null) return NotFound("User profile not found.");

            profile.AllowMarketingEmails = dto.AllowMarketingEmails;
            await _context.SaveChangesAsync();

            return Ok("Marketing email preference updated.");
        }

        // Admin-only  Update Points for a user
        [HttpPut("edit-points")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditPoints([FromBody] EditPointsDTO dto)
        {
            var editorUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var editorProfile = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == editorUserId);

            if (editorProfile == null)
                return Unauthorized("Admin user profile not found.");

            var editorMember = await _context.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == editorProfile.Id);

            var member = await _context.ZLGMembers
                .Include(m => m.UserProfile)
                .ThenInclude(up => up.User)
                .FirstOrDefaultAsync(m => m.UserProfileId == dto.UserProfileId);

            if (member == null)
                return NotFound("Target member not found.");

            if (member.Points != dto.OldPoints)
                return BadRequest("Point mismatch. Please refresh and try again.");

            var editorDiscord = editorMember?.DiscordName ?? "(Unknown Editor)";
            var targetDiscord = member.DiscordName ?? "(Unknown Target)";

            Log.Information("{EditorDiscord} edited points for {TargetDiscord} from {Old} to {New} at {Time}",
                editorDiscord,
                targetDiscord,
                dto.OldPoints,
                dto.Points,
                DateTime.UtcNow);

            member.Points = dto.Points;
            await _context.SaveChangesAsync();

            return Ok("Points updated successfully.");
        }

    }
}
