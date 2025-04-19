using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public NotificationController(ZombieLynxPortalAPIDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ✅ Admin: Create a Notification
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Invalid notification data.");

            Console.WriteLine($"DTO Received: {System.Text.Json.JsonSerializer.Serialize(dto)}");

            var notification = new Notification
            {
                Message = dto.Message,
                IsGlobal = dto.IsGlobal,
                CreatedAt = DateTime.UtcNow,
                Expiration = null
            };

            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            if (dto.IsGlobal)
            {
                // Assign notification to all users
                var userProfiles = await _dbContext.UserProfiles.ToListAsync();
                foreach (var userProfile in userProfiles)
                {
                    await _dbContext.UserNotifications.AddAsync(new UserNotification
                    {
                        NotificationId = notification.Id,
                        UserProfileId = userProfile.Id,
                        IsRead = false
                    });
                }
            }
            else if (dto.TargetUserIds != null && dto.TargetUserIds.Any())
            {
                foreach (var userId in dto.TargetUserIds)
                {
                    if (await _dbContext.UserProfiles.AnyAsync(up => up.Id == userId))
                    {
                        await _dbContext.UserNotifications.AddAsync(new UserNotification
                        {
                            NotificationId = notification.Id,
                            UserProfileId = userId,
                            IsRead = false
                        });
                    }
                }
            }


            await _dbContext.SaveChangesAsync();
            return Ok(new { notification.Id, notification.Message, notification.IsGlobal });
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
                .FirstOrDefaultAsync(up => up.Id == dto.UserProfileId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var notification = new Notification
            {
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

            Console.WriteLine($"📨 Notification sent to UserProfileId {userProfile.Id} with message:\n{dto.Message}");

            return Ok(new { notification.Id, notification.Message });
        }

    }
}

