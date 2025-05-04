public class PreviouslyLinkedAccount
{
    public int Id { get; set; }

    public string Platform { get; set; }
    public string ExternalId { get; set; }

    public DateTime UnlinkedAt { get; set; }
}
