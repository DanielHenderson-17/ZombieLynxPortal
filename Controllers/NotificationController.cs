using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;
using ZombieLynxPortalAPI.Services.Email;
using Serilog;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IEmailSender _emailSender;
        private readonly string _frontendBaseUrl;

        public NotificationController(ZombieLynxPortalAPIDbContext dbContext, IEmailSender emailSender, IConfiguration config)
        {
            _dbContext = dbContext;
            _emailSender = emailSender;
            _frontendBaseUrl = config["FrontendBaseUrl"];
        }

        // ✅ Admin: Create a Notification
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Invalid notification data.");

            Log.Information("📥 DTO Received: {DtoJson}", System.Text.Json.JsonSerializer.Serialize(dto));

            var notification = new Notification
            {
                Subject = dto.Subject,
                Message = dto.Message,
                IsGlobal = dto.IsGlobal,
                CreatedAt = DateTime.UtcNow,
                Expiration = null
            };

            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            var unsubscribeFooter = $@"
                <p style='font-size:10px;color:gray;margin-top:30px;'>
                To manage your marketing email preferences, click <a href='{_frontendBaseUrl}/member/settings/privacy'>here</a>.
                </p>";

            if (dto.IsGlobal)
            {
                // Send to all users who allow marketing emails
                var userProfiles = await _dbContext.UserProfiles
                    .Include(up => up.User)
                    .Where(up => up.User != null)
                    .ToListAsync();

                foreach (var userProfile in userProfiles)
                {
                    await _dbContext.UserNotifications.AddAsync(new UserNotification
                    {
                        NotificationId = notification.Id,
                        UserProfileId = userProfile.Id,
                        IsRead = false
                    });

                    if (userProfile.AllowMarketingEmails && !string.IsNullOrEmpty(userProfile.User.Email))
                    {
                        var emailBody = dto.Message + unsubscribeFooter;
                        await _emailSender.SendEmailAsync(userProfile.User.Email, dto.Subject, emailBody);
                    }
                }
            }
            else if (dto.TargetUserIds != null && dto.TargetUserIds.Any())
            {
                foreach (var userId in dto.TargetUserIds)
                {
                    var userProfile = await _dbContext.UserProfiles
                        .Include(up => up.User)
                        .FirstOrDefaultAsync(up => up.Id == userId);

                    if (userProfile != null)
                    {
                        await _dbContext.UserNotifications.AddAsync(new UserNotification
                        {
                            NotificationId = notification.Id,
                            UserProfileId = userProfile.Id,
                            IsRead = false
                        });

                        if (userProfile.AllowMarketingEmails && userProfile.User != null && !string.IsNullOrEmpty(userProfile.User.Email))
                        {
                            var emailBody = dto.Message + unsubscribeFooter;
                            await _emailSender.SendEmailAsync(userProfile.User.Email, dto.Subject, emailBody);
                        }
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { notification.Id, notification.Subject, notification.Message, notification.IsGlobal });
        }

        // ✅ User: Get Notifications for the Logged-in User
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found.");

            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId.ToString() == userId);
            if (userProfile == null)
                return NotFound("User profile not found.");

            var notifications = await _dbContext.UserNotifications
                .Include(un => un.Notification)
                .Where(un => un.UserProfileId == userProfile.Id)
                .Select(un => new
                {
                    un.Notification.Id,
                    un.Notification.Subject,
                    un.Notification.Message,
                    un.Notification.CreatedAt,
                    un.Notification.IsGlobal,
                    un.IsRead
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // ✅ User: Mark a Notification as Read
        [HttpPut("read")]
        [Authorize]
        public async Task<IActionResult> MarkNotificationAsRead([FromBody] MarkNotificationReadDTO dto)
        {
            if (dto == null || dto.NotificationId <= 0)
                return BadRequest("Invalid notification data.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found.");

            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId.ToString() == userId);
            if (userProfile == null)
                return NotFound("User profile not found.");

            var userNotification = await _dbContext.UserNotifications
                .FirstOrDefaultAsync(un => un.UserProfileId == userProfile.Id && un.NotificationId == dto.NotificationId);

            if (userNotification == null)
                return NotFound("Notification not found for the user.");

            userNotification.IsRead = true;
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _dbContext.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound($"Notification with ID {id} not found.");

            var userNotifications = await _dbContext.UserNotifications
                .Where(un => un.NotificationId == id)
                .ToListAsync();

            if (userNotifications.Any())
                _dbContext.UserNotifications.RemoveRange(userNotifications);
            _dbContext.Notifications.Remove(notification);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Admin: Get All Users and their IDs
        [HttpGet("GetAllUsersAndId")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsersAndId()
        {
            var users = await _dbContext.UserProfiles
                .Include(up => up.User)
                .Select(up => new
                {
                    UserId = up.User.Id,
                    ProfileId = up.Id,
                    FirstName = up.FirstName,
                    LastName = up.LastName,
                    Email = up.User.Email,
                    Role = up.User.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("tebex-payment-notify")]
        [AllowAnonymous]
        public async Task<IActionResult> TebexPaymentNotify([FromBody] TebexPaymentNotificationDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message) || dto.UserProfileId <= 0)
                return BadRequest("Missing or invalid notification data.");

            var userProfile = await _dbContext.UserProfiles
                .Include(up => up.User)
                .FirstOrDefaultAsync(up => up.Id == dto.UserProfileId);

            if (userProfile == null || userProfile.User == null || string.IsNullOrEmpty(userProfile.User.Email))
                return NotFound("User profile or email not found.");

            var notification = new Notification
            {
                Subject = "Tebex Payment Notification",
                Message = dto.Message,
                IsGlobal = false,
                CreatedAt = DateTime.UtcNow,
                Expiration = null
            };

            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            await _dbContext.UserNotifications.AddAsync(new UserNotification
            {
                NotificationId = notification.Id,
                UserProfileId = userProfile.Id,
                IsRead = false
            });

            await _dbContext.SaveChangesAsync();

            // ✅ Always send the email (payment notifications must be delivered)
            await _emailSender.SendEmailAsync(
                userProfile.User.Email,
                "Your Payment was Successful!",
                dto.Message
            );

            Log.Information("📨 Tebex payment notification and email sent to UserProfileId {UserProfileId} with message:\n{Message}", userProfile.Id, dto.Message);

            return Ok(new { notification.Id, notification.Message, notification.Subject });
        }

    }
}

