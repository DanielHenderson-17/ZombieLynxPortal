public class TebexPackageItem
{
    public long PackageId { get; set; }
    public int Quantity { get; set; }
    public Dictionary<string, object>? VariableData { get; set; }
}