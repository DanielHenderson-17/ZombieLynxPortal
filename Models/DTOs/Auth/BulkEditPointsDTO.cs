public class BulkEditPointsDTO
{
    public List<SinglePointEdit> Edits { get; set; } = new();

    public class SinglePointEdit
    {
        public int UserProfileId { get; set; }
        public int OldPoints { get; set; }
        public int Points { get; set; }
    }
}
