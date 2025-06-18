using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Data
{
    [Table("statsyncqueue")]
    public class ArkStats
    {
        [Key]
        [MaxLength(50)]
        public string SteamId { get; set; }

        public int MinutesPlayed { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string TribeName { get; set; }

        public long QuestsCompleted { get; set; }

        public long DailyQuestsCompleted { get; set; }

        public long WeeklyQuestsCompleted { get; set; }

        public long PlayerKills { get; set; }

        public long PlayerDeaths { get; set; }

        public long WildDinoKills { get; set; }

        public long TamedDinoKills { get; set; }

        public long BossKills { get; set; }

        [Column("K/D", TypeName = "decimal(65,2)")]
        public decimal KD { get; set; }

        public long TotalDeaths { get; set; }

        public long PvPDamage { get; set; }

        public long TamedDinos { get; set; }

        public long MissionsCompleted { get; set; }

        public long BlueOSD { get; set; }

        public long RedOSD { get; set; }

        public long PurpleOSD { get; set; }

        public long FishCaught { get; set; }

        public long AlphaKills { get; set; }

        public long FiberHarvest { get; set; }
    }
}
