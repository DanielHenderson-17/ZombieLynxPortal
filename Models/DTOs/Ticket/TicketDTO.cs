namespace ZombieLynxPortalAPI.DTOs
{
    public class TicketDTO
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Game { get; set; }
        public string Server { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int UserProfileId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
