using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace ZombieLynxPortalAPI.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Ticket")]
        public int MessageGroupId { get; set; }

        public Ticket Ticket { get; set; }

        [ForeignKey("UserProfile")]
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "jsonb")]
        public string ImgUrlsJson { get; set; } = "[]";

        [NotMapped]
        public List<string> ImgUrls
        {
            get => string.IsNullOrEmpty(ImgUrlsJson) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(ImgUrlsJson);
            set => ImgUrlsJson = JsonConvert.SerializeObject(value ?? new List<string>());
        }


        public ulong? DiscordUserId { get; set; }
        public string? DiscordUserName { get; set; }
        public string? DiscordImgUrl { get; set; }
        public ulong? DiscordMessageId { get; set; }
        public bool SentToDiscord { get; set; } = false;
    }
}
