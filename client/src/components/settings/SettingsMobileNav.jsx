import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function SettingsMobileNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav px-2 py-4 bg-dark rounded-end-0 rounded-3 shadow ${
        isOpen ? "ticket-float-open" : "ticket-float-closed"
      }`}
    >
      <button
        className="ticket-float-toggle p-0 bg-dark"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <i
          className={`bi ${isOpen ? "bi-chevron-right" : "bi-chevron-left"}`}
        ></i>
      </button>

      {/* General */}
      <Link
        to="/member/settings/general"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname === "/member/settings/general"
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-gear-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">General</small>
      </Link>

      {/* Privacy */}
      <Link
        to="/member/settings/privacy"
        className={`text-decoration-none d-flex flex-column align-items-center position-relative mb-2 ${
          location.pathname === "/member/settings/privacy"
            ? "text-white"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-shield-lock-fill fs-4"></i>
        <small className="ticket-mobile-nav-title">Privacy</small>
      </Link>

      {/* Linked Accounts */}
      <Link
        to="/member/settings/linked-accounts"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/settings/linked-accounts"
            ? "text-white"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-link-45deg fs-4"></i>
        <small className="ticket-mobile-nav-title">Accounts</small>
      </Link>
    </div>
  );
}
