import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function VotesMobileNav({ loggedInUser }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  if (loggedInUser?.role !== "Admin") return null;

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav notifications-float-nav py-3 px-3 bg-dark rounded-end-0 rounded-3 shadow ${
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
        to="/member/vote/create"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname === "/member/vote/create"
            ? "text-success fs-1"
            : "text-white"
        }`}
      >
        <i className="bi bi-plus-circle text-white fs-2"></i>
        <small className="ticket-mobile-nav-title">Create</small>
      </Link>
    </div>
  );
}
