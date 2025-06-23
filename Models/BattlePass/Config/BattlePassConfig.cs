using System;
using System.Collections.Generic;

namespace ZombieLynxPortalAPI.Models.BattlePass.Config
{
    public class BattlePassConfig
    {
        public int ActiveBp { get; set; }
        public int XpPerLevel { get; set; }
        public int DailyXpCap { get; set; }
        public PremiumConfig Premium { get; set; }
        public Dictionary<int, BattlePassSeason> BattlePasses { get; set; }
    }
}
