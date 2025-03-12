using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ZombieLynxPortalAPI.DTOs
{
    public class MessageDTO
    {
        public int Id { get; set; }

        public int MessageGroupId { get; set; }

        public int UserProfileId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        // ✅ Ensure JSON string storage and conversion
        [JsonProperty("ImgUrlsJson")]
        public List<string> ImgUrlsJson { get; set; } = new List<string>();
    }
}
