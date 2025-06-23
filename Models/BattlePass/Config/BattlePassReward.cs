using System.Collections.Generic;

namespace ZombieLynxPortalAPI.Models.BattlePass.Config
{
    public class BattlePassReward
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public int Amount { get; set; }
        public bool Premium { get; set; }
        public string Img { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public List<string> Compatibility { get; set; }
    }
}
