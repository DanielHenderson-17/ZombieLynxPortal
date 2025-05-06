using System;

namespace ZombieLynxPortalAPI.DTOs
{
    public class UserTicketDTO
    {
        public int UserProfileId { get; set; }
        public int TicketId { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
