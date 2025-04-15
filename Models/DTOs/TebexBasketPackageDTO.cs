public class TebexBasketPackageDTO
{
    public string Ident { get; set; } = string.Empty;

    public List<TebexPackageItem> Packages { get; set; } = new();
}