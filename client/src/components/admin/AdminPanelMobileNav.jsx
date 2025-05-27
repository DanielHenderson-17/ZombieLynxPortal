import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AdminPanelMobileNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav py-3 px-3 bg-dark rounded-end-0 rounded-3 shadow ${
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

      {/* Users */}
      <Link
        to="/member/admin/users"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname.includes("/member/admin/users")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-people-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">Users</small>
      </Link>
    </div>
  );
}
