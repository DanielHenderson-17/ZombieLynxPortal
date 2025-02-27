namespace ZombieLynxPortalAPI.DTOs
{
    public class ZLGMemberDTO
    {
        public int Id { get; set; }
        public string? SteamId { get; set; }
        public string? SteamName { get; set; }
        public string? SteamImgUrl { get; set; }
        public string? DiscordId { get; set; }
        public string? DiscordName { get; set; }
        public string? DiscordImgUrl { get; set; }
        public string? EosId { get; set; }
        public string? EpicName { get; set; }
        public string? EpicImgUrl { get; set; }
        public string? MinecraftUuid { get; set; }
        public string? MinecraftUsername { get; set; }
        public string? MinecraftAvatarUrl { get; set; }
        public int? UserProfileId { get; set; }
        public UserProfileDTO? UserProfile { get; set; }
    }
}
