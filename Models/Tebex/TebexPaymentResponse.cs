using Newtonsoft.Json;
using System;
using System.Collections.Generic;

public class TebexPaymentsResponse
{
    [JsonProperty("data")]
    public List<TebexPayment> Data { get; set; }

    [JsonProperty("current_page")]
    public int CurrentPage { get; set; }

    [JsonProperty("last_page")]
    public int LastPage { get; set; }
}

public class TebexPayment
{
    [JsonProperty("id")]
    public long Id { get; set; }

    [JsonProperty("amount")]
    public string Amount { get; set; }

    [JsonProperty("date")]
    public DateTime Date { get; set; }

    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("player")]
    public TebexPlayer Player { get; set; }

    [JsonProperty("packages")]
    public List<TebexPackage> Packages { get; set; }
}

public class TebexPlayer
{
    [JsonProperty("id")]
    public long Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("uuid")]
    public string UUID { get; set; }
}

public class TebexPackage
{
    [JsonProperty("id")]
    public long Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("quantity")]
    public int Quantity { get; set; }
}