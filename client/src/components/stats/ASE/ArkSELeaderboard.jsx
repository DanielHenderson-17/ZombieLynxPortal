import { useEffect, useState } from "react";
import { getTopTenArkStats } from "../../../managers/arkStatsManager";
import { formatDiscordName } from "../../../utils/formatDiscordName";

const fallbackAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";

export default function ArkSELeaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getTopTenArkStats().then((data) => {
      if (data && Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => b.playerKills - a.playerKills);
        setPlayers(sorted);
      }
    });
  }, []);
  return (
    <div className="text-white">
      <h5 className="text-center mb-4">🏆 ASE PvP Leaderboard (Top 10)</h5>
      <div className="ase-leaderboard-wrapper">
        <table className="table table-dark table-borderless mb-0 align-middle ase-leaderboard-table">
          <thead className="text-secondary small">
            <tr>
              <th scope="col" className="d-none d-md-table-cell">
                #
              </th>
              <th scope="col" className="text-start player-col">
                <span className="stat-label-sm">Player</span>
              </th>

              <th scope="col" className="text-end px-2 stat-col">
                <span className="stat-label-sm">Kills</span>
              </th>
              <th scope="col" className="text-end px-3 stat-col">
                <span className="stat-label-sm">Deaths</span>
              </th>
              <th scope="col" className="text-end px-3 stat-col">
                <span className="stat-label-sm">K/D</span>
              </th>
              <th scope="col" className="text-end px-2 stat-col">
                <span className="stat-label-sm">Damage</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const avatarUrl = player.discordImgUrl || fallbackAvatar;
              const displayName = player.discordName || player.name;

              return (
                <tr key={index} className="bg-dark rounded">
                  <td className="text-secondary d-none d-md-table-cell">
                    #{index + 1}
                  </td>
                  <td className="player-col">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="rounded-circle leaderboard-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackAvatar;
                        }}
                      />

                      <span className="fw-semibold">
                        {formatDiscordName(displayName)}
                      </span>
                    </div>
                  </td>
                  <td className="text-end px-2 stat-col">
                    {player.playerKills}
                  </td>
                  <td className="text-end px-3 stat-col">
                    {player.playerDeaths}
                  </td>
                  <td className="text-end px-3 stat-col">
                    {Number(player.kd).toFixed(1)}
                  </td>
                  <td className="text-end px-2 stat-col">
                    {player.pvPDamage.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
