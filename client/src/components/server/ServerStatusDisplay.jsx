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
    <div
      className="col-11 mx-auto server-status-display"
      id="ServerStatusDisplay"
    >
      {/* Server Status Header */}
      <h3 className="text-start text-danger server-status-title mb-3">
        SERVER <span className="text-white ms-2">STATUS</span>
        <span className="server-status-line"></span>
      </h3>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mt-3 d-flex justify-content-between col-12 border-0 mb-0 p-0">
        {servers.map((server) => (
          <li
            key={server.id}
            className="nav-item col server-status-tab mx-1 rounded-2 text-center fw-bold my-md-0 my-1"
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
      <div className="tab-content mt-0 mx-1">
        {servers.map((server) => (
          <div
            key={server.id}
            className={`tab-pane ${
              activeServer.id === server.id ? "show active" : "fade"
            }`}
            id={server.tabId}
          >
            <section
              id={server.sectionId}
              className="text-white mt-0 mb-2 mb-0 p-0 border-0 server-status-table-bg rounded-3"
            >
              <table className="server-status-table mx-auto text-white col-12 pb-3 server-status-bg rounded-bottom-3">
                <thead>
                  <tr className="border-bottom border-secondary col-12">
                    <th className="col-1 text-start ps-2 status-title">
                      Status
                    </th>
                    <th className="text-start vertical-line col-7 p-0 status-title">
                      Server
                    </th>
                    <th className="vertical-line col-1 d-none d-md-table-cell status-title">
                      Version
                    </th>
                    <th className="vertical-line col-md-1 col-4 status-title">
                      Players
                    </th>
                    <th className="vertical-line col-1 status-title">Vote</th>
                    <th className="vertical-line col-1 d-none d-md-table-cell status-title ">
                      Connect
                    </th>
                  </tr>
                </thead>
                <tbody className="font-monospace">
                  {activeServerData.map((server) => (
                    <tr className="text-start" key={server.serverName}>
                      <td className="text-start">
                        <img
                          src={
                            server.isOnline
                              ? "/src/assets/images/online.png"
                              : "/src/assets/images/offline.png"
                          }
                          alt={server.isOnline ? "Online" : "Offline"}
                          className="status-icon"
                        />
                      </td>
                      <td className="text-start p-0 status-title">
                        <span className="d-none d-md-inline">
                          {server.name}
                        </span>
                        <span className="d-md-none">
                          {server.serverName || "N/A"}
                        </span>
                      </td>

                      <td className="font-monospace d-none d-md-block status-title">
                        {server.version}
                      </td>
                      <td className=" col-md-1 col-4 p-md-1 p-0 status-title">{`${server.players} / ${server.maxPlayers}`}</td>
                      <td className="pt-3 px-2 col-1 status-title">
                        <a
                          href={server.voteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vote-connect-button border-0 rounded-2 m-3 py-2 px-3 text-white text-decoration-none"
                        >
                          Vote
                        </a>
                      </td>
                      <td className="pt-3 px-2 d-none d-md-block status-title">
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
