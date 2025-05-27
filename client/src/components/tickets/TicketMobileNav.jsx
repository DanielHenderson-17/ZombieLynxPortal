import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function TicketMobileNav({ openTicketCount }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav p-3 bg-dark rounded-end-0 rounded-3 shadow ${
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

      {/* Create */}
      <Link
        to="/member/tickets/new-ticket"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname === "/member/tickets/new-ticket"
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-plus-circle fs-2"></i>
        <small className="ticket-mobile-nav-title">Create</small>
      </Link>

      {/* Open */}
      <Link
        to="/member/tickets/open-tickets"
        className={`text-decoration-none d-flex flex-column align-items-center position-relative mb-2 ${
          location.pathname === "/member/tickets/open-tickets"
            ? "text-white"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-inbox-fill fs-4"></i>
        <small className="ticket-mobile-nav-title">Open</small>
        {openTicketCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            {openTicketCount}
          </span>
        )}
      </Link>

      {/* Closed */}
      <Link
        to="/member/tickets/closed-tickets"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/tickets/closed-tickets"
            ? "text-white"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-trash3 fs-4"></i>
        <small className="ticket-mobile-nav-title">Closed</small>
      </Link>
    </div>
  );
}
