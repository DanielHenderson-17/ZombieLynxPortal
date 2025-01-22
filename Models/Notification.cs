using System;
using System.ComponentModel.DataAnnotations;

namespace ZombieLynxPortalAPI.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Message { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? Expiration { get; set; }

        [Required]
        public bool IsGlobal { get; set; } = false;
        // Navigation property to UserNotifications
        public ICollection<UserNotification> UserNotifications { get; set; }
    }
}
