import { useEffect, useState } from "react";
import { getMyTribeStats } from "../../../managers/arkStatsManager";
import { getLinkedDiscordAccount } from "../../../managers/authManager";
import { formatDiscordName } from "../../../utils/formatDiscordName";

const fallbackAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";

export default function ArkSETribe() {
  const [tribeData, setTribeData] = useState(null);
  const [myDiscordName, setMyDiscordName] = useState(null);

  useEffect(() => {
    // Fetch current Discord name and tribe data
    Promise.all([getLinkedDiscordAccount(), getMyTribeStats()])
      .then(([discord, tribe]) => {
        setMyDiscordName(discord?.discordUsername || null);
        setTribeData(tribe);
      })
      .catch((err) =>
        console.error("Failed to load tribe or Discord identity", err)
      );
  }, []);

  if (!tribeData || !tribeData.members || !myDiscordName)
    return <div className="text-white text-center py-4">Loading tribe...</div>;

  const { tribeName, members } = tribeData;

  const filteredMembers = members.filter(
    (m) => (m.discordName || m.name) !== myDiscordName
  );

  return (
    <div className="text-white small">
      <h6 className="text-start my-1">{tribeName}</h6>
      <div className="table-responsive">
        <table
          className="table table-dark table-borderless table-sm align-middle mb-0"
          style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}
        >
          <thead className="text-secondary small">
            <tr>
              <th className="text-start">Player</th>
              <th className="text-end">Kills</th>
              <th className="text-end">Deaths</th>
              <th className="text-end">K/D</th>
              <th className="text-end">Damage</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m, index) => (
              <tr className="dino-card" key={index} style={{ height: "34px" }}>
                <td className="text-start fw-semibold d-flex align-items-center gap-2 rounded-start-2 py-2 dino-card">
                  <img
                    src={m.discordImgUrl || fallbackAvatar}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: 20, height: 20 }}
                  />
                  <span className="text-truncate" style={{ maxWidth: "100px" }}>
                    {formatDiscordName(m.discordName || m.name)}
                  </span>
                </td>
                <td className="text-end py-2 dino-card">{m.playerKills}</td>
                <td className="text-end py-2 dino-card">{m.playerDeaths}</td>
                <td className="text-end py-2 dino-card">{m.kd}</td>
                <td className="text-end rounded-end-2 pe-2 py-2 dino-card">
                  {m.pvPDamage.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
