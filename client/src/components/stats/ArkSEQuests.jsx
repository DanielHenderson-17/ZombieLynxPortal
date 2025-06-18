import { useEffect, useState } from "react";
import { getMyArkStats } from "../../managers/arkStatsManager";

export default function ArkSEQuests() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMyArkStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  if (!stats) {
    return (
      <div className="text-white text-center py-4">Loading quest stats...</div>
    );
  }

  return (
    <div className="text-white small chart-shell position-relative">
      <h6 className="mb-3 text-center">🎯 Quest & Harvest Stats</h6>
      <ul className="list-unstyled mb-0">
        <li>Total Quests Completed: {stats.questsCompleted}</li>
        <li>Daily Quests Completed: {stats.dailyQuestsCompleted}</li>
        <li>Weekly Quests Completed: {stats.weeklyQuestsCompleted}</li>
        <li>Fish Caught: {stats.fishCaught}</li>
        <li>Fiber Harvested: {stats.fiberHarvest}</li>
      </ul>
    </div>
  );
}
