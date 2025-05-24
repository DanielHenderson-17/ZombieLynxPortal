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

      <Link
        to="/member/tickets/new-ticket"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/tickets/new-ticket"
            ? "text-success fs-1"
            : "text-white"
        }`}
      >
        <i className="bi bi-plus-circle text-white fs-2"></i>
        <small className="ticket-mobile-nav-title">Create</small>
      </Link>

      <Link
        to="/member/tickets/open-tickets"
        className={`text-decoration-none my-4 d-flex flex-column align-items-center position-relative ${
          location.pathname === "/member/tickets/open-tickets"
            ? "text-primary"
            : "text-white"
        }`}
      >
        <i className="fa-solid fa-inbox text-white fs-4"></i>
        <small className="ticket-mobile-nav-title">Open</small>
        {openTicketCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            {openTicketCount}
          </span>
        )}
      </Link>

      <Link
        to="/member/tickets/closed-tickets"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/tickets/closed-tickets"
            ? "text-primary"
            : "text-white"
        }`}
      >
        <i className="fa-regular fa-trash-can text-white fs-4"></i>
        <small className="ticket-mobile-nav-title">Closed</small>
      </Link>
    </div>
  );
}
