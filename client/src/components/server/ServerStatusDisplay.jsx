import { useState, useEffect } from "react";
import "../../assets/styles/ServerStatusDisplay.css";
import { fetchServerData } from "../../managers/serverManager";

export default function ServerStatusDisplay() {
  const servers = [
    { id: 1, name: "Ark:SE", tabId: "tabs-1-1", sectionId: "ArkSE" },
    { id: 2, name: "Ark:SA", tabId: "tabs-1-2", sectionId: "arkSA" },
    { id: 3, name: "Eco", tabId: "tabs-1-3", sectionId: "ecos" },
    { id: 4, name: "Minecraft", tabId: "tabs-1-4", sectionId: "minecrafts" },
    { id: 5, name: "Empyrion", tabId: "tabs-1-7", sectionId: "empyrions" },
  ];

  const [activeServer, setActiveServer] = useState(servers[0]);
  const [serverDataCache, setServerDataCache] = useState({});

  useEffect(() => {
    // Preload data for all servers in parallel
    async function preloadServerData() {
      const dataPromises = servers.map(async (server) => {
        const data = await fetchServerData(server.name);
        return { name: server.name, data };
      });

      const results = await Promise.all(dataPromises);

      // Cache the data
      const cache = {};
      results.forEach((result) => {
        cache[result.name] = result.data;
      });

      setServerDataCache(cache);
    }

    preloadServerData();
  }, [servers]);

  // Get the active server's data from the cache
  const activeServerData = serverDataCache[activeServer.name] || [];

  // Helper function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="mb-5">
      {/* Server Status Header */}
      <h3 className="text-start text-danger server-status-title mb-3">
        Server <span className="text-white ms-2">Status</span>
        <span className="server-status-line"></span>
      </h3>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mt-3 d-flex justify-content-between col-12 border-0">
        {servers.map((server) => (
          <li
            key={server.id}
            className="nav-item col server-status-tab mx-1 rounded-2 text-center fw-bold"
          >
            <button
              className={`nav-link server-status-link text-white col-12 border-0 ${
                activeServer.id === server.id ? "active" : ""
              }`}
              onClick={() => setActiveServer(server)}
            >
              {server.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {servers.map((server) => (
          <div
            key={server.id}
            className={`tab-pane ${
              activeServer.id === server.id ? "show active" : "fade"
            }`}
            id={server.tabId}
          >
            <section id={server.sectionId} className="text-white mb-5 pb-3">
              <div className="d-flex mx-auto col-12 mb-2">
                <img
                  src={`./assets/images/${server.name.toLowerCase()}.png`}
                  alt=""
                  className="my-auto"
                />
                <h4 className="text-start col-12 ms-2 my-auto">
                  {server.name} Server Status
                </h4>
              </div>

              <table className="server-status-table mx-auto text-white">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th className="text-start vertical-line ps-4">
                      Server Name
                    </th>
                    <th className="vertical-line">Version</th>
                    <th className="vertical-line">Players</th>
                    <th className="vertical-line">Vote</th>
                    <th className="vertical-line">Connect</th>
                  </tr>
                </thead>
                <tbody className="font-monospace">
                  {activeServerData.map((server) => (
                    <tr className="text-start" key={server.serverName}>
                      <td>
                        <img
                          src={
                            server.isOnline
                              ? "/src/assets/images/online.png"
                              : "/src/assets/images/offline.png"
                          }
                          alt={server.isOnline ? "Online" : "Offline"}
                        />
                      </td>
                      <td className="text-start">{server.name}</td>
                      <td>{server.version}</td>
                      <td>{`${server.players} / ${server.maxPlayers}`}</td>
                      <td>
                        <a
                          href={server.voteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className=" vote-connect-button rounded-2 p-3"
                        >
                          Vote
                        </a>
                      </td>
                      <td>
                        {activeServer.name === "Minecraft" ? (
                          <button
                            className="btn btn-primary"
                            onClick={() => copyToClipboard(server.connectInfo)}
                          >
                            Copy
                          </button>
                        ) : (
                          <a
                            href={server.connectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
