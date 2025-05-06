using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class UserNotification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("UserProfile")]
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        [Required]
        [ForeignKey("Notification")]
        public int NotificationId { get; set; }
        public Notification Notification { get; set; }

        [Required]
        public bool IsRead { get; set; } = false;
    }
}
