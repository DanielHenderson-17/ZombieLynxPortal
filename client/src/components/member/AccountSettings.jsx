import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GeneralSettings from "./GeneralSettings";
import PrivacySettings from "./PrivacySettings";
import LinkedAccountsSettings from "./LinkedAccountsSettings";
import { settingsTabs } from "../../utils/settingsTabs";
import "./Settings.css";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("General");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl && settingsTabs.some((t) => t.name === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

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
          {settingsTabs.map((tab) => (
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
      <div className="flex-grow-1 settings-main px-md-4 px-0 pt-4">
        {renderTabContent()}
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="d-lg-none fixed-bottom bg-dark text-white bottom-nav">
        <div className="d-flex justify-content-around pt-2 pb-1 my-1">
          {settingsTabs.map((tab) => (
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
