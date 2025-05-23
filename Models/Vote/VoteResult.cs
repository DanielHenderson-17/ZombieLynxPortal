using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class VoteResult
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int VoteId { get; set; }

        [ForeignKey("VoteId")]
        public Vote Vote { get; set; } = null!;

        [Required]
        public int ZLGMemberId { get; set; }

        [ForeignKey("ZLGMemberId")]
        public ZLGMember ZLGMember { get; set; } = null!;

        [Required]
        public bool VotedFor { get; set; }

        [Required]
        public DateTime VotedAt { get; set; } = DateTime.UtcNow;
    }
}
