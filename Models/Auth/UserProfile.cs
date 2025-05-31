using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User User { get; set; }
        public bool AllowMarketingEmails { get; set; } = true;
        public bool HasAcceptedTerms { get; set; } = false;
    }
}
