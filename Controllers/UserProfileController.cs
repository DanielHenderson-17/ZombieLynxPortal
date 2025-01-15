using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;

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
                    Role = up.User.Role
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
                .Select(u => new
                {
                    u.Id,
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
    }
}
