using System.Collections.Generic;
using YamlDotNet.Serialization;

namespace ZombieLynxPortalAPI.Models.BattlePass.Config
{
    public class BattlePassReward
    {
        [YamlMember(Alias = "type")]
        public string Type { get; set; }

        [YamlMember(Alias = "id")]
        public string Id { get; set; }

        [YamlMember(Alias = "arkshop_key")]
        public string? ArkShopKey { get; set; }

        [YamlMember(Alias = "amount")]
        public int Amount { get; set; }

        [YamlMember(Alias = "rarity")]
        public string Rarity { get; set; }

        [YamlMember(Alias = "premium")]
        public bool Premium { get; set; }

        [YamlMember(Alias = "img")]
        public string Img { get; set; }

        [YamlMember(Alias = "description")]
        public string Description { get; set; }

        [YamlMember(Alias = "category")]
        public string Category { get; set; }

        [YamlMember(Alias = "compatibility")]
        public List<string> Compatibility { get; set; }
    }
}
