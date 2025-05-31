import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import GeneralSettings from "./GeneralSettings";
import PrivacySettings from "./PrivacySettings";
import LinkedAccountsSettings from "./LinkedAccountsSettings";
import SettingsMobileNav from "./SettingsMobileNav";
import "./Settings.css";

export default function AccountSettings() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`d-flex flex-column flex-lg-row fade-container settings-container text-white ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      {/* Sidebar for Desktop Navigation */}
      <div className="col-lg-2 p-3 d-none d-lg-block border-0">
        <div>
          <Link
            to="/member/settings/general"
            className={`text-decoration-none ${
              location.pathname === "/member/settings/general" ? "active" : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
              <i
                className={`bi me-3 ${
                  location.pathname === "/member/settings/general"
                    ? "bi-gear-fill text-white"
                    : "bi-gear text-secondary"
                }`}
              ></i>
              <p
                className={`m-0 p-0 ${
                  location.pathname === "/member/settings/general"
                    ? "text-white"
                    : "text-secondary"
                }`}
              >
                General
              </p>
            </button>
          </Link>

          <Link
            to="/member/settings/privacy"
            className={`text-decoration-none ${
              location.pathname === "/member/settings/privacy" ? "active" : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
              <i
                className={`bi me-3 ${
                  location.pathname === "/member/settings/privacy"
                    ? "bi-shield-lock-fill text-white"
                    : "bi-shield-lock text-secondary"
                }`}
              ></i>
              <p
                className={`m-0 p-0 ${
                  location.pathname === "/member/settings/privacy"
                    ? "text-white"
                    : "text-secondary"
                }`}
              >
                Privacy
              </p>
            </button>
          </Link>

          <Link
            to="/member/settings/linked-accounts"
            className={`text-decoration-none ${
              location.pathname === "/member/settings/linked-accounts"
                ? "active"
                : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
              <i
                className={`bi me-3 ${
                  location.pathname === "/member/settings/linked-accounts"
                    ? "bi-link-45deg text-white"
                    : "bi-link-45deg text-secondary"
                }`}
              ></i>
              <p
                className={`m-0 p-0 ${
                  location.pathname === "/member/settings/linked-accounts"
                    ? "text-white"
                    : "text-secondary"
                }`}
              >
                Linked Accounts
              </p>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 mb-0 settings-main">
        <Routes>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="linked-accounts" element={<LinkedAccountsSettings />} />
          <Route path="" element={<GeneralSettings />} />
        </Routes>
      </div>

      {/* Bottom Navigation for Mobile */}
      <SettingsMobileNav />
    </div>
  );
}
