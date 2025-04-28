public class CreateNotificationDTO
{

    public string Subject { get; set; }
    public string Message { get; set; }

    public bool IsGlobal { get; set; }

    public List<int>? TargetUserIds { get; set; }
}
