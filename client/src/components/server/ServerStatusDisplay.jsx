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

  // Fetch the active server's data once on mount
  useEffect(() => {
    async function fetchInitialData() {
      const data = await fetchServerData(activeServer.name);
      setServerDataCache((prev) => ({ ...prev, [activeServer.name]: data }));
    }

    fetchInitialData();
  }, [activeServer.name]); // Only run once on component mount

  // Handle fetching data on tab click
  const handleTabClick = async (server) => {
    setActiveServer(server);

    // Check if data is already cached
    if (!serverDataCache[server.name]) {
      const data = await fetchServerData(server.name);
      setServerDataCache((prev) => ({ ...prev, [server.name]: data }));
    }
  };

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
        SERVER <span className="text-white ms-2">STATUS</span>
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
              onClick={() => handleTabClick(server)}
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
                  src={`/src/assets/images/${server.name
                    .toLowerCase()
                    .replace(/[:]/g, "")}.png`}
                  alt=""
                  className="my-auto"
                  style={{ width: "30px" }}
                />
                <h4 className="text-start col-12 ms-2 my-auto">
                  {server.name} Server Status
                </h4>
              </div>

              <table className="server-status-table mx-auto text-white">
                <thead>
                  <tr>
                    <th className="col-1">Status</th>
                    <th className="text-start vertical-line ps-4 col-7">
                      Server Name
                    </th>
                    <th className="vertical-line col-1">Version</th>
                    <th className="vertical-line col-1">Players</th>
                    <th className="vertical-line col-1">Vote</th>
                    <th className="vertical-line col-1">Connect</th>
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
                      <td className="font-monospace">{server.version}</td>
                      <td>{`${server.players} / ${server.maxPlayers}`}</td>
                      <td className="p-2">
                        <a
                          href={server.voteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vote-connect-button border-0 rounded-2 m-3 py-2 px-3 text-white text-decoration-none"
                        >
                          Vote
                        </a>
                      </td>
                      <td>
                        {activeServer.name === "Minecraft" ? (
                          <a
                            className="vote-connect-button border-0 rounded-2 m-3 py-2 px-3 text-white text-decoration-none"
                            onClick={() => copyToClipboard(server.connectInfo)}
                          >
                            Copy
                          </a>
                        ) : (
                          <a
                            href={server.connectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vote-connect-button border-0 rounded-2 m-3 py-2 px-3 text-white text-decoration-none"
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
