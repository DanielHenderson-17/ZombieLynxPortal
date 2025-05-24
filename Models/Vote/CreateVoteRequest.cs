namespace ZombieLynxPortalAPI.Models
{
    public class CreateVoteRequest
    {
        public int GameId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
