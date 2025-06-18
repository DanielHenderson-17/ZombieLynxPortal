import { useEffect, useState } from "react";
import { getTopTenArkStats } from "../../managers/arkStatsManager";
import { formatDiscordName } from "../../utils/formatDiscordName";

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
      <div className="table-responsive">
        <table className="table table-dark table-borderless mb-0 align-middle">
          <thead className="text-secondary small">
            <tr>
              <th scope="col">#</th>
              <th scope="col" className="text-start">
                Player
              </th>
              <th scope="col" className="text-end px-2">
                Kills
              </th>
              <th scope="col" className="text-end px-3">
                Deaths
              </th>
              <th scope="col" className="text-end px-3">
                K/D
              </th>
              <th scope="col" className="text-end px-2">
                Damage
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const avatarUrl = player.discordImgUrl || fallbackAvatar;
              const displayName = player.discordName || player.name;

              return (
                <tr key={index} className="bg-dark rounded shadow-sm">
                  <td className="text-secondary">#{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: 32, height: 32 }}
                      />
                      <span className="fw-semibold">
                        {formatDiscordName(displayName)}
                      </span>
                    </div>
                  </td>
                  <td className="text-end px-2">{player.playerKills}</td>
                  <td className="text-end px-3">{player.playerDeaths}</td>
                  <td className="text-end px-3">{player.kd}</td>
                  <td className="text-end px-2">
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
