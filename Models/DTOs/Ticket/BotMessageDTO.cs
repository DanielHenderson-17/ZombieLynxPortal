using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ZombieLynxPortalAPI.DTOs
{
    public class BotMessageDTO
    {
        public int MessageGroupId { get; set; }
        public string Content { get; set; }
        public List<string> ImgUrlsJson { get; set; } = new List<string>();
        public ulong DiscordUserId { get; set; }
        public string DiscordUserName { get; set; }
        public string DiscordImgUrl { get; set; }
        public ulong DiscordMessageId { get; set; }
    }
}
