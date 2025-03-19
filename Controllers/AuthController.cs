using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.DTOs;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ZombieLynxPortalAPIDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/Register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            Console.WriteLine("Incoming registration data:");
            Console.WriteLine($"Email: {dto.Email}, FirstName: {dto.FirstName}, LastName: {dto.LastName}, DiscordId: {dto.DiscordId}");

            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email is already in use.");

            if (await _context.ZLGMembers.AnyAsync(m => m.DiscordId == dto.DiscordId))
                return BadRequest("This Discord account is already linked to another user.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User",
                Profile = new UserProfile
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName
                }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == user.Id);

            if (userProfile == null)
            {
                return BadRequest("UserProfile creation failed.");
            }

            var zlgMember = new ZLGMember
            {
                DiscordId = dto.DiscordId,
                DiscordName = dto.DiscordName,
                DiscordImgUrl = dto.DiscordImgUrl,
                UserProfileId = user.Profile.Id
            };

            _context.ZLGMembers.Add(zlgMember);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                user.Profile.FirstName,
                user.Profile.LastName,
                zlgMember.DiscordId,
                zlgMember.DiscordName,
                zlgMember.DiscordImgUrl
            });
        }


        // POST: api/Auth/Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users.Include(u => u.Profile)
                                           .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var jwtKey = jwtSettings["Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT key is not configured.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("UserId", user.Id.ToString()),
        new Claim("FullName", $"{user.Profile.FirstName} {user.Profile.LastName}")
    };

            claims.Add(new Claim(ClaimTypes.Role, user.Role));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpireHours"] ?? throw new ArgumentNullException("ExpireHours"))),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpGet("admin-only")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("Admin access granted.");
        }

        [HttpGet("user-only")]
        [Authorize(Roles = "User")]
        public IActionResult UserOnlyEndpoint()
        {
            return Ok("User access granted.");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                user.Profile.FirstName,
                user.Profile.LastName
            });
        }


        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok("Logged out successfully. Please clear your token.");
        }
        [HttpGet("verify-admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult VerifyAdmin()
        {
            return Ok("You are an Admin.");
        }

    }
}
