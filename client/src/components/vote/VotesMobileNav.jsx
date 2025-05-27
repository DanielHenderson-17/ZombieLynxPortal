import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function VotesMobileNav({ loggedInUser }) {
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

      {/* Create Vote (Admin only) */}
      {loggedInUser?.role === "Admin" && (
        <Link
          to="/member/vote/create"
          className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
            location.pathname.includes("/member/vote/create")
              ? "text-white fs-1"
              : "text-secondary"
          }`}
        >
          <i className="bi bi-plus-circle fs-2"></i>
          <small className="ticket-mobile-nav-title">Create</small>
        </Link>
      )}

      {/* Active Votes */}
      <Link
        to="/member/vote/active"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname.includes("/member/vote/active")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-check-square-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">Active</small>
      </Link>

      {/* Expired Votes */}
      <Link
        to="/member/vote/expired"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname.includes("/member/vote/expired")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-clock-fill fs-2"></i>
        <small className="ticket-mobile-nav-title">Expired</small>
      </Link>
    </div>
  );
}
