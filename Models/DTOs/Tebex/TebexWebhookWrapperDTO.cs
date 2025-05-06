namespace ZombieLynxPortalAPI.DTOs
{
    public class TebexWebhookWrapperDTO
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public TebexPaymentsDTO Subject { get; set; }
    }
}
