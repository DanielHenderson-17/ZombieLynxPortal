// components/settings/AccountSettings.jsx
import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import PrivacySettings from "./PrivacySettings";
import LinkedAccountsSettings from "./LinkedAccountsSettings";
import "../../assets/styles/tickets.css"; // using ticket styles for now

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General", icon: "bi-gear", badge: null },
    { name: "Privacy", icon: "bi-shield-lock", badge: null },
    { name: "Accounts", icon: "bi-person-badge", badge: null },
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
    <div className="d-flex flex-column flex-lg-row ticket-container text-white">
      {/* Sidebar */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
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
      <div className="flex-grow-1 mb-0 ticket-main px-4 pt-4">
        {renderTabContent()}
      </div>
    </div>
  );
}
