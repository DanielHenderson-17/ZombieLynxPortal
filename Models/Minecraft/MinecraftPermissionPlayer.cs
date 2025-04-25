using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models.Minecraft
{
    [Table("luckperms_user_permissions")]
    public class MinecraftPermissionPlayer
    {
        [Key]
        public int Id { get; set; }

        public string Uuid { get; set; }

        public string Permission { get; set; }

        public bool Value { get; set; }

        public string Server { get; set; }

        public string World { get; set; }

        public long Expiry { get; set; }

        public string Contexts { get; set; }
    }
}
