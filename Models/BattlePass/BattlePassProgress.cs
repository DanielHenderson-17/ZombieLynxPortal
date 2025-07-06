using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models
{
    public class BattlePassProgress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ZLGMemberId { get; set; }

        [ForeignKey("ZLGMemberId")]
        public ZLGMember ZLGMember { get; set; }

        public int XP { get; set; } = 0;

        public bool HasPremium { get; set; } = false;

        public DateTime? PremiumPurchasedAt { get; set; }

        public DateTime? LastXPUpdate { get; set; }
        public int LastMinutesPlayed { get; set; } = 0;
        public int UnprocessedMinutes { get; set; } = 0;
        public int XpEarnedToday { get; set; } = 0;
    }
}
