using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Data
{
    [Table("arkshopplayers")]
    public class AsaShopPlayer
    {
        [Key]
        public int Id { get; set; }
        public string EosId { get; set; }
        public int Points { get; set; }
    }
}
