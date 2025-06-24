import { useEffect, useState } from "react";
import "../Stats.css";
import ArkSEPVP from "./ArkSEPVP";
import ArkSELeaderboard from "./ArkSELeaderboard";
import ArkSEDinos from "./ArkSEDinos";
import ArkSEMissions from "./ArkSEMissions";
import ArkSETribe from "./ArkSETribe";

export default function ArkSEStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [season, setSeason] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`notifications-container fade-container stats-container ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="row pt-md-1 mt-md-3 px-md-4 px-2">
        {/* ✅ Left 2/3: Charts + Season Header */}
        <div className="col-md-8 col-12 px-md-3 px-0">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-3 mt-2 arkse-topbar">
            <div>
              <h4 className="text-white mb-md-0 mb-2">
                Zombie Lynx Gaming ASE - Season 1
              </h4>
            </div>
            <div className="mt-2 mt-md-0">
              <select
                className="form-select form-select-sm bg-dark text-white border border-black"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                disabled
              >
                <option value="">Select Season</option>
              </select>

              <div className="text-secondary small mb-1 pb-1 mt-1">
                * Previous seasons coming soon
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6 col-12 px-md-1 px-0">
              <h6 className="text-start text-secondary">PVP Stats</h6>
              <div className="bg-dark border border-black rounded py-5 px-1 shadow-sm stat-card">
                <ArkSEPVP />
              </div>
            </div>
            <div className="col-md-6 col-12 px-md-1 px-0">
              <h6 className="text-start text-secondary">My Tribe</h6>
              <div className="bg-dark border border-black rounded p-1 shadow-sm stat-card">
                <ArkSETribe />
              </div>
            </div>
            <div className="col-md-6 col-12 px-md-1 px-0">
              <h6 className="text-start text-secondary">Dinos & Quests</h6>
              <div className="bg-dark border border-black rounded p-1 shadow-sm stat-card">
                <ArkSEDinos />
              </div>
            </div>
            <div className="col-md-6 col-12 px-md-1 px-0">
              <h6 className="text-start text-secondary">Missions & OSDs</h6>
              <div className="bg-dark border border-black rounded py-1 px-1 shadow-sm stat-card">
                <ArkSEMissions />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Right 1/3: Leaderboard */}
        <div className="col-md-4 col-12 mt-3 mt-md-0 mb-md-0 mb-3 p-0">
          <div className="bg-dark border border-black rounded d-flex justify-content-center align-items-center p-md-3 px-0 pt-3 shadow-sm h-100 ">
            <ArkSELeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
