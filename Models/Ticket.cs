using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Subject { get; set; }

        [Required, MaxLength(50)]
        public string Category { get; set; }

        [Required, MaxLength(50)]
        public string Game { get; set; }

        [Required, MaxLength(100)]
        public string Server { get; set; }

        [Required]
        public string Description { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserProfile")]
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        public ICollection<UserTicket> UserTickets { get; set; }
        public ICollection<AdminTicket> AdminTickets { get; set; }

        public ICollection<Message> Messages { get; set; }
        public ulong? DiscordChannelId { get; set; }
        public ulong? DiscordUserId { get; set; }

    }
}
