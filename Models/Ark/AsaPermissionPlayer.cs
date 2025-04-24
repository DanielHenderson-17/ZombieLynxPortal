using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZombieLynxPortalAPI.Models.Ark
{
    [Table("players")]
    public class AsaPermissionPlayer
    {
        [Key]
        public int Id { get; set; }

        [Column("EOS_Id")]
        public string EosId { get; set; }

        public string PermissionGroups { get; set; }

        public string TimedPermissionGroups { get; set; }
    }
}
