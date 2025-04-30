// components/settings/AccountSettings.jsx
import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import PrivacySettings from "./PrivacySettings";
import LinkedAccountsSettings from "./LinkedAccountsSettings";
import "../../assets/styles/settings.css";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General", icon: "bi-gear" },
    { name: "Privacy", icon: "bi-shield-lock" },
    { name: "Accounts", icon: "bi-person-badge" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return <GeneralSettings />;
      case "Privacy":
        return <PrivacySettings />;
      case "Accounts":
        return <LinkedAccountsSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex flex-lg-row settings-container text-white">
      {/* Sidebar for Desktop */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0 overflow-auto">
        <div>
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`text-decoration-none ${
                activeTab === tab.name ? "active" : ""
              }`}
            >
              <button
                className="btn d-block w-100 text-start mb-2 text-white d-flex justify-content-between align-items-center"
                onClick={() => setActiveTab(tab.name)}
              >
                <div className="d-flex align-items-center open-tickets">
                  <i className={`bi ${tab.icon} me-3 text-white`}></i>
                  <p className="m-0 p-0">{tab.name}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 settings-main px-4 pt-4">
        {renderTabContent()}
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="d-lg-none fixed-bottom bg-dark text-white bottom-nav">
        <div className="d-flex justify-content-around pt-2 pb-1 my-1">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`text-decoration-none text-white ${
                activeTab === tab.name ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.name)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex flex-column align-items-center">
                <i className={`bi ${tab.icon} fs-4`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
