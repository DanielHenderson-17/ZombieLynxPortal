using System.Text.Json;

public class TebexBaseWebhookDTO
{
    public DateTime Date { get; set; }
    public string Id { get; set; }
    public string Type { get; set; }
    public JsonElement Subject { get; set; }
}
