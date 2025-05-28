import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NotificationsMobileNav({ loggedInUser }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav ticket-float-nav py-3 px-3 bg-dark rounded-end-0 rounded-3 shadow ${
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

      {/* Create Notification (Admin only) */}
      {loggedInUser?.role === "Admin" && (
        <Link
          to="/member/notifications/create"
          className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
            location.pathname.includes("/member/notifications/create")
              ? "text-white fs-1"
              : "text-secondary"
          }`}
        >
          <i className="bi bi-plus-circle fs-2"></i>
          <small className="ticket-mobile-nav-title">Create</small>
        </Link>
      )}

      {/* Inbox */}
      <Link
        to="/member/notifications/inbox"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname.includes("/member/notifications/inbox")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-inbox-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">Inbox</small>
      </Link>

      {/* Read */}
      <Link
        to="/member/notifications/read"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname.includes("/member/notifications/read")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-archive-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">Read</small>
      </Link>
    </div>
  );
}
