import { useEffect, useState } from "react";
import { getMyArkStats } from "../../managers/arkStatsManager";

export default function ArkSEMissions() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMyArkStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  if (!stats) {
    return (
      <div className="text-white text-center py-4">
        Loading mission stats...
      </div>
    );
  }

  return (
    <div className="text-white small chart-shell position-relative">
      <h6 className="mb-3 text-center">🛰️ Missions & OSDs</h6>
      <ul className="list-unstyled mb-0">
        <li>Missions Completed: {stats.missionsCompleted}</li>
        <li>Blue OSDs: {stats.blueOSD}</li>
        <li>Red OSDs: {stats.redOSD}</li>
        <li>Purple OSDs: {stats.purpleOSD}</li>
      </ul>
    </div>
  );
}
