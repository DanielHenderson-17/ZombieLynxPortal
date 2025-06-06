public class FlatPaymentRecord
{
    public long TransactionId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string PlayerName { get; set; }
    public string PlayerUuid { get; set; }
    public int PackageQuantity { get; set; }
    public string PackageName { get; set; }
    public long PackageId { get; set; }
}
