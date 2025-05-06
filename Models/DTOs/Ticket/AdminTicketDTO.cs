using System;

namespace ZombieLynxPortalAPI.DTOs
{
    public class AdminTicketDTO
    {
        public int AdminId { get; set; }
        public int TicketId { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
