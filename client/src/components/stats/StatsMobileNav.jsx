import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function StatsMobileNav() {
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

      {/* Ark:SE */}
      <Link
        to="/member/stats/arkse"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname.includes("/member/stats/arkse")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-graph-up fs-2"></i>
        <small className="ticket-mobile-nav-title">Ark:SE</small>
      </Link>

      {/* Ark:SA */}
      <Link
        to="/member/stats/arksa"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname.includes("/member/stats/arksa")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-bar-chart fs-2"></i>
        <small className="ticket-mobile-nav-title">Ark:SA</small>
      </Link>

      {/* Minecraft */}
      <Link
        to="/member/stats/minecraft"
        className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
          location.pathname.includes("/member/stats/minecraft")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-cube fs-2"></i>
        <small className="ticket-mobile-nav-title">Minecraft</small>
      </Link>

      {/* Rust */}
      <Link
        to="/member/stats/rust"
        className={`text-decoration-none d-flex flex-column align-items-center ${
          location.pathname.includes("/member/stats/rust")
            ? "text-white fs-1"
            : "text-secondary"
        }`}
      >
        <i className="bi bi-hammer fs-2"></i>
        <small className="ticket-mobile-nav-title">Rust</small>
      </Link>
    </div>
  );
}
