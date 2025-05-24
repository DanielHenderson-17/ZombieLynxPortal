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

      <Link
        to="/member/settings/general"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/settings/general"
            ? "text-success fs-1"
            : "text-white"
        }`}
      >
        <i className="fa-solid fa-gear text-white fs-2"></i>
        <small className="ticket-mobile-nav-title">General</small>
      </Link>

      <Link
        to="/member/settings/privacy"
        className={`text-decoration-none my-4 d-flex flex-column align-items-center position-relative ${
          location.pathname === "/member/settings/privacy"
            ? "text-primary"
            : "text-white"
        }`}
      >
        <i className="fa-solid fa-shield-halved text-white fs-4"></i>
        <small className="ticket-mobile-nav-title">Privacy</small>
      </Link>

      <Link
        to="/member/settings/linked-accounts"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/settings/linked-accounts"
            ? "text-primary"
            : "text-white"
        }`}
      >
        <i className="fa-solid fa-link text-white fs-4"></i>
        <small className="ticket-mobile-nav-title">Accounts</small>
      </Link>
    </div>
  );
}
