using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Services.Email;
using Serilog;

namespace ZombieLynxPortalAPI.Services.Notifications
{
    public class TebexNotificationService
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IEmailSender _emailSender;

        public TebexNotificationService(ZombieLynxPortalAPIDbContext dbContext, IEmailSender emailSender)
        {
            _dbContext = dbContext;
            _emailSender = emailSender;
        }

        public async Task<bool> SendNotificationAsync(TebexPaymentNotificationDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message) || dto.UserProfileId <= 0)
            {
                Log.Warning("Invalid Tebex notification payload.");
                return false;
            }

            var userProfile = await _dbContext.UserProfiles
                .Include(up => up.User)
                .FirstOrDefaultAsync(up => up.Id == dto.UserProfileId);

            if (userProfile == null || userProfile.User == null || string.IsNullOrEmpty(userProfile.User.Email))
            {
                Log.Warning("User or email not found for profile ID {UserProfileId}", dto.UserProfileId);
                return false;
            }

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

            await _emailSender.SendEmailAsync(
                userProfile.User.Email,
                "Your Payment was Successful!",
                dto.Message
            );

            Log.Information("📨 Tebex notification sent to UserProfileId {UserProfileId}", userProfile.Id);
            return true;
        }
    }
}
