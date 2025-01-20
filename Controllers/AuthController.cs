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
            Console.WriteLine("Incoming registration data: ");
            Console.WriteLine($"Email: {dto.Email}, FirstName: {dto.FirstName}, LastName: {dto.LastName}");
            Console.WriteLine($"DTO: {System.Text.Json.JsonSerializer.Serialize(dto)}");


            // ❗ Validate password confirmation
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            // ❗ Check for duplicate email
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email is already in use.");

            // 🔐 Hash the password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // ➕ Create the user
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User",  // Default role
                Profile = new UserProfile
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName
                }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // ✅ Return created user with profile info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                user.Profile.FirstName,
                user.Profile.LastName
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

        // JWT Token Generation
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

            // Support multiple roles if needed
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("UserId", user.Id.ToString()),  // Explicit user ID for matching
        new Claim("FullName", $"{user.Profile.FirstName} {user.Profile.LastName}") // Optional
    };

            // If the role is a single value
            claims.Add(new Claim(ClaimTypes.Role, user.Role));

            // If the role could be multiple, use this:
            // var roles = user.Roles.Split(',');  // Example if roles are stored as comma-separated
            // claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpireHours"])),
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
            // Client must clear the token from session storage
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
