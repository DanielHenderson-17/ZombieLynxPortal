using System;
using System.Collections.Generic;

namespace ZombieLynxPortalAPI.Models.BattlePass.Config
{
    public class BattlePassSeason
    {
        public string Name { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public Dictionary<int, BattlePassReward> Rewards { get; set; }
    }
}
