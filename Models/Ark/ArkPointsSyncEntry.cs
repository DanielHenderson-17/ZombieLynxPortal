namespace ZombieLynxPortalAPI.Models.Ark
{
    public class ArkPointsSyncEntry
    {
        public int Id { get; set; }
        public string SteamId { get; set; } = null!;
        public long OldPoints { get; set; }
        public long NewPoints { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Synced { get; set; }
        public int Points => (int)NewPoints;

    }
}
