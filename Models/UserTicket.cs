using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class UserTicket
    {
        // Composite Key: UserProfileId + TicketId

        [ForeignKey("UserProfile")]
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        [ForeignKey("Ticket")]
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
