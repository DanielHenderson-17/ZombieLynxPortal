namespace ZombieLynxPortalAPI.DTOs
{
    public class TebexPaymentsDTO
    {
        public string OrderId { get; set; }
        public PriceInfo Price { get; set; }
        public List<PackageInfo> Packages { get; set; }
    }

    public class PriceInfo
    {
        public string Currency { get; set; }
        public decimal Amount { get; set; }
    }

    public class PackageInfo
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
    }
}
