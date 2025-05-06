using System.Collections.Generic;

namespace ZombieLynxPortalAPI.DTOs
{
    public class CreateTicketDTO
    {
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Game { get; set; }
        public string Server { get; set; }
        public string Description { get; set; }
        public List<int> AssignedUserIds { get; set; }
    }
}
