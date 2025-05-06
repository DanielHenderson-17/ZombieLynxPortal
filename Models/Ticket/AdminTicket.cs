using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class AdminTicket
    {
        [ForeignKey("Admin")]
        public int AdminId { get; set; }
        public UserProfile Admin { get; set; }

        [ForeignKey("Ticket")]
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
