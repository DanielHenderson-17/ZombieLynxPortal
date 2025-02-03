import { useState } from "react";
import "../../assets/styles/ServerListDisplay.css";

export default function ServerListDisplay() {
  const servers = [
    {
      id: 1,
      title: "Ark: Survival Evolved",
      thumbImg: "/src/assets/images/ark-thumb.png",
      mainImg: "/src/assets/images/ark-main.png",
      category: "MMO Survival",
      description:
        "We host 12 cross Ark servers that feature vote rewards, login points, and weekly events.",
    },
    {
      id: 2,
      title: "Ark: Survival Ascended",
      thumbImg: "/src/assets/images/arkSA-thumb.png",
      mainImg: "/src/assets/images/arkSA-main.png",
      category: "MMO Survival",
      description:
        "Ark: Survival Evolved remastered on Unreal Engine 5. Benefits include vote rewards and an in-game shop.",
    },
    {
      id: 3,
      title: "Eco: Global Survival",
      thumbImg: "/src/assets/images/eco-thumb.png",
      mainImg: "/src/assets/images/eco-main.png",
      category: "Sandbox Simulation",
      description:
        "Eco is a sandbox simulation game where you work together to prevent a meteor from destroying the planet.",
    },
    {
      id: 4,
      title: "Minecraft: Java Edition",
      thumbImg: "/src/assets/images/minecraft-thumb.png",
      mainImg: "/src/assets/images/minecraft-main.png",
      category: "Sandbox",
      description:
        "We host survival, creative, bedwars, parkour, and many other servers. Earn points and vote rewards, with an in-game shop.",
    },
    {
      id: 5,
      title: "Empyrion: Galactic Survival",
      thumbImg: "/src/assets/images/empyrion-thumb.png",
      mainImg: "/src/assets/images/empyrion-main.png",
      category: "Space Survival",
      description:
        "Empyrion is our longest-running server with a loyal player base. Explore the infinite universe of Reforged Eden.",
    },
  ];

  const [activeServer, setActiveServer] = useState(servers[0]);

  return (
    <div className="mt-3">
      <h1 className="text-start text-danger server-status-title mb-3">
        Server <span className="text-white ms-2">Status</span>
        <span className="server-status-line"></span>
      </h1>
      <div className="d-flex server-list">
        {/* Server List */}
        <div className="col-6">
          <ul className="list-group text-start rounded-start-2 rounded-end-0">
            {servers.map((server) => (
              <li
                key={server.id}
                className={`list-group-item d-flex p-1 text-white border-0 ${
                  activeServer.id === server.id ? "active bg-danger" : ""
                }`}
                onClick={() => setActiveServer(server)}
              >
                <img
                  src={server.thumbImg}
                  alt={server.title}
                  className="img-fluid me-2 col-3 rounded-2 server-thumb"
                  style={{ width: "100px" }}
                />
                <div className="col-10">
                  {/* Title: Always white and bold */}
                  <p className="m-0 fw-bold text-white">{server.title}</p>

                  {/* Description: Conditional color based on active status */}
                  <p
                    className={`m-0 ${
                      activeServer.id === server.id
                        ? "text-white"
                        : "text-secondary"
                    }`}
                  >
                    {server.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Server Details */}
        <div className="col-6">
          <div className="text-center">
            <img
              src={activeServer.mainImg}
              alt={activeServer.title}
              className="img-fluid mb-3 w-100"
            />
            <h3>{activeServer.title}</h3>
            <span className="badge bg-primary">{activeServer.category}</span>
            <p className="mt-3">{activeServer.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
