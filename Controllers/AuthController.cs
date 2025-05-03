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
using ZombieLynxPortalAPI.Services.Email;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _frontendBaseUrl;
        private readonly IEmailSender _emailSender;

        public AuthController(ZombieLynxPortalAPIDbContext context, IConfiguration configuration, IEmailSender emailSender)
        {
            _context = context;
            _configuration = configuration;
            _frontendBaseUrl = _configuration["Frontend:BaseUrl"];
            _emailSender = emailSender;
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

            // ✅ Create a verification code
            var verificationCode = Guid.NewGuid().ToString();

            // ✅ Create EmailVerification record
            var emailVerification = new EmailVerification
            {
                UserId = user.Id,
                VerificationCode = verificationCode,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false
            };

            _context.EmailVerifications.Add(emailVerification);
            await _context.SaveChangesAsync();

            // ✅ Build the verification link (temporary logging for now)
            var verificationLink = $"{_frontendBaseUrl}/verify-email?code={verificationCode}";
            var subject = "Confirm your email for Zombie Lynx Portal";
            var body = $"<p>Thank you for registering!</p><p>Please confirm your email by clicking the link below:</p><p><a href='{verificationLink}'>Verify Email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, subject, body);

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
                UserProfileId = userProfile.Id,
                PermissionGroups = "Default",
                TimedPermissionGroups = null,
                Points = 0
            };

            _context.ZLGMembers.Add(zlgMember);
            await _context.SaveChangesAsync();

            // ✅ Create two personal notifications for the new user
            var welcomeNotification = new Notification
            {
                Subject = "🎉 Welcome to Zombie Lynx Gaming!",
                Message = "Thanks for registering! You're officially part of the Zombie Lynx Player Portal. 🧟‍♂️",
                IsGlobal = false,
                CreatedAt = DateTime.UtcNow
            };

            var reminderNotification = new Notification
            {
                Subject = "🔗 Link Your Game Accounts",
                Message = "Don't forget to link your Steam, Minecraft, and other accounts for full access to features and rewards.",
                IsGlobal = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddRangeAsync(welcomeNotification, reminderNotification);
            await _context.SaveChangesAsync(); // Save to get IDs

            await _context.UserNotifications.AddRangeAsync(
                new UserNotification
                {
                    NotificationId = welcomeNotification.Id,
                    UserProfileId = userProfile.Id,
                    IsRead = false
                },
                new UserNotification
                {
                    NotificationId = reminderNotification.Id,
                    UserProfileId = userProfile.Id,
                    IsRead = false
                }
            );

            await _context.SaveChangesAsync();


            // ✅ Convert DiscordId from string to ulong for comparison
            var discordIdAsUlong = ulong.TryParse(dto.DiscordId, out var parsedId) ? parsedId : (ulong?)null;

            if (discordIdAsUlong != null)
            {
                // ✅ Find existing tickets with this Discord ID
                var existingTickets = await _context.Tickets
                    .Where(t => t.DiscordUserId == discordIdAsUlong)
                    .ToListAsync();

                if (existingTickets.Any())
                {
                    foreach (var ticket in existingTickets)
                    {
                        ticket.UserProfileId = userProfile.Id;

                        // ✅ Also create a UserTicket entry
                        var userTicket = new UserTicket
                        {
                            UserProfileId = userProfile.Id,
                            TicketId = ticket.Id,
                            AssignedAt = DateTime.UtcNow
                        };

                        _context.UserTickets.Add(userTicket);
                    }

                    await _context.SaveChangesAsync();
                    Console.WriteLine($"✅ Updated {existingTickets.Count} tickets and created UserTickets.");
                }
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                user.Profile.FirstName,
                user.Profile.LastName,
                zlgMember.DiscordId,
                zlgMember.DiscordName,
                zlgMember.DiscordImgUrl,
                Token = token
            });
        }


        // Put: api/Auth/update-account
        [HttpPut("update-account")]
        [Authorize]
        public async Task<IActionResult> UpdateAccount(UpdateAccountDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
                return NotFound("User not found.");

            // Update name fields if provided
            if (!string.IsNullOrWhiteSpace(dto.FirstName))
                user.Profile.FirstName = dto.FirstName;

            if (!string.IsNullOrWhiteSpace(dto.LastName))
                user.Profile.LastName = dto.LastName;

            // Handle password change if any password fields are present
            bool wantsToChangePassword = !string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                                         !string.IsNullOrWhiteSpace(dto.NewPassword) ||
                                         !string.IsNullOrWhiteSpace(dto.ConfirmNewPassword);

            if (wantsToChangePassword)
            {
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                    string.IsNullOrWhiteSpace(dto.NewPassword) ||
                    string.IsNullOrWhiteSpace(dto.ConfirmNewPassword))
                {
                    return BadRequest("To change your password, all password fields must be filled.");
                }

                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                {
                    return BadRequest("Current password is incorrect.");
                }

                if (dto.NewPassword != dto.ConfirmNewPassword)
                {
                    return BadRequest("New password and confirmation do not match.");
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok("Account updated successfully.");
        }


        // POST: api/Auth/Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users.Include(u => u.Profile)
                                           .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            if (!user.Verified)
                return Unauthorized("Please verify your email before logging in.");

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

        // POST: api/Auth/verify-email?code=xyz
        [HttpPost("verify-email")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromQuery] string code)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest("Verification code is required.");

            var verification = await _context.EmailVerifications
                .Include(ev => ev.User)
                .FirstOrDefaultAsync(ev => ev.VerificationCode == code);

            if (verification == null)
                return BadRequest("Invalid or expired verification code.");

            if (verification.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Verification code has expired.");

            if (verification.IsUsed)
                return BadRequest("Verification code has already been used.");

            // ✅ Mark user as verified
            verification.User.Verified = true;
            verification.IsUsed = true;

            await _context.SaveChangesAsync();

            return Ok("Email verified successfully. You can now log in.");
        }
        // POST: api/Auth/resend-verification
        [HttpPost("resend-verification")]
        [AllowAnonymous]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email is required.");

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                // ✅ Don't leak info whether user exists or not
                return Ok("If your email exists in our system, a verification email has been sent.");
            }

            if (user.Verified)
            {
                return Ok("Account is already verified.");
            }

            // ✅ Invalidate previous verification codes if you want (optional)
            var existingVerifications = _context.EmailVerifications
                .Where(ev => ev.UserId == user.Id && !ev.IsUsed);

            _context.EmailVerifications.RemoveRange(existingVerifications);

            // ✅ Create new verification code
            var verificationCode = Guid.NewGuid().ToString();

            var emailVerification = new EmailVerification
            {
                UserId = user.Id,
                VerificationCode = verificationCode,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false
            };

            _context.EmailVerifications.Add(emailVerification);
            await _context.SaveChangesAsync();

            // ✅ Build new link
            var frontendUrl = _configuration["Frontend:BaseUrl"];
            var verificationLink = $"{frontendUrl}/verify-email?code={verificationCode}";

            var subject = "Resend: Confirm your email for Zombie Lynx Portal";
            var body = $"<p>Please confirm your email by clicking the link below:</p><p><a href='{verificationLink}'>Verify Email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, subject, body);

            return Ok("Verification email resent successfully.");
        }
    }
}
