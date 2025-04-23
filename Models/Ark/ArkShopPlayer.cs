using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Data
{
    [Table("arkshopplayers")]
    public class ArkShopPlayer
    {
        [Key]
        public int Id { get; set; }
        public ulong SteamId { get; set; }
        public int Points { get; set; }
    }
}
