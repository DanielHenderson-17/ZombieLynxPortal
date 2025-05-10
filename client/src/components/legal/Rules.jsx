import { useState } from "react";
import DiscordRules from "./DiscordRules";
import ASERules from "./ASERules";
import ASARules from "./ASARules";
import MinecraftRules from "./MinecraftRules";
import RustRules from "./RustRules";
import EmpyrionRules from "./EmpyrionRules";
import EcoRules from "./EcoRules";
import "./Rules.css";

export default function Rules() {
  const tabs = [
    "Discord",
    "ASE",
    "ASA",
    "Minecraft",
    "Rust",
    "Empyrion",
    "Eco",
  ];
  const [activeTab, setActiveTab] = useState("Discord");

  const rulesComponents = {
    Discord: <DiscordRules />,
    ASE: <ASERules />,
    ASA: <ASARules />,
    Minecraft: <MinecraftRules />,
    Rust: <RustRules />,
    Empyrion: <EmpyrionRules />,
    Eco: <EcoRules />,
  };

  return (
    <div className="rules-container mt-5 pt-5">
      <h3 className="mb-4 text-white">Zombie Lynx Gaming Server Rules</h3>

      {/* Tabs Container */}
      <ul className="nav nav-tabs row g-2 border-0 d-flex">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`
              mx-1
              p-0
              text-white
              server-status-tab
              nav-item
              d-flex
              flex-fill
              col-12 
              col-lg-${tab === "Discord" ? "12" : "3"}
              col-4k-${tab === "Discord" ? "12" : "1"}
            `}
          >
            <button
              className={`nav-link server-status-link text-white border-0 col-12 ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="rules-content mt-4">
        <h3 className="text-white">{activeTab} Rules</h3>
        {rulesComponents[activeTab]}
      </div>
    </div>
  );
}
