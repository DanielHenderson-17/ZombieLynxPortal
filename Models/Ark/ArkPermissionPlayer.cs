using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models.Ark
{
    [Table("players")]
    public class ArkPermissionPlayer
    {
        [Key]
        public int Id { get; set; }

        public ulong SteamId { get; set; }

        public string PermissionGroups { get; set; }

        public string TimedPermissionGroups { get; set; }
    }
}
