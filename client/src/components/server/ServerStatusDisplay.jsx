import { useState } from "react";
import "../../assets/styles/ServerStatusDisplay.css";

export default function ServerStatusDisplay() {
  // Define server tabs with table data references
  const servers = [
    { id: 1, name: "Ark:SE", tabId: "tabs-1-1", sectionId: "ArkSE" },
    { id: 2, name: "Ark:SA", tabId: "tabs-1-2", sectionId: "arkSA" },
    { id: 3, name: "Eco", tabId: "tabs-1-3", sectionId: "ecos" },
    { id: 4, name: "Minecraft", tabId: "tabs-1-4", sectionId: "minecrafts" },
    { id: 5, name: "Empyrion", tabId: "tabs-1-7", sectionId: "empyrions" },
  ];

  // State to track active server tab
  const [activeServer, setActiveServer] = useState(servers[0]);

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
                <tbody
                  id={`${server.name.toLowerCase()}List`}
                  className="font-monospace"
                ></tbody>
              </table>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
