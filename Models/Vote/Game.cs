using System.ComponentModel.DataAnnotations;

namespace ZombieLynxPortalAPI.Models
{
    public class Game
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        // e.g. Steam, Epic, Minecraft
        [Required]
        [MaxLength(50)]
        public string Platform { get; set; } = string.Empty;
    }
}
