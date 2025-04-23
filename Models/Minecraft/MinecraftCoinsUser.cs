using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Data
{
    [Table("coinsengine_users")]
    public class MinecraftCoinsUser
    {
        [Key]
        public int Id { get; set; }

        public string uuid { get; set; }

        public int coins { get; set; }
    }
}
