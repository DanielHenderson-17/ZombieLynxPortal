using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class BattlePassClaim
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ZLGMemberId { get; set; }

        [ForeignKey("ZLGMemberId")]
        public ZLGMember ZLGMember { get; set; }

        [Required]
        public int LevelNumber { get; set; }

        public DateTime ClaimedAt { get; set; } = DateTime.UtcNow;
    }
}
