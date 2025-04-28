namespace ZombieLynxPortalAPI.Models.Ark
{
    public class AsaPointsSyncEntry
    {
        public int Id { get; set; }
        public string EosId { get; set; } = null!;
        public long OldPoints { get; set; }
        public long NewPoints { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Synced { get; set; }
        public int Points => (int)NewPoints;
    }
}
