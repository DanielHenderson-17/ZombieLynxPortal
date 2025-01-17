using System;

namespace ZombieLynxPortalAPI.DTOs
{
    public class MessageDTO
    {
        public int Id { get; set; }

        public int MessageGroupId { get; set; }

        public int UserProfileId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ImgUrl { get; set; }
    }
}
