namespace ZombieLynxPortalAPI.Models
{
    public class EmailVerification
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string VerificationCode { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;

        public User User { get; set; }
    }
}
