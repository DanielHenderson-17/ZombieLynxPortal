import { NavLink } from "react-router-dom";
import { useState } from "react";
import NavBarMobileMainMenu from "./NavBarMobileMainMenu";
import zlgLogo from "../../assets/nav/zlg-logo.webp";

export default function NavBarMobile({ loggedInUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <>
      {/* TOP NAV */}
      <div
        className="position-fixed top-0 start-0 end-0 bg-dark d-flex zlg-nav-bar justify-content-between align-items-center px-3 py-2 d-md-none"
        style={{ zIndex: 10050 }}
      >
        <NavLink to="/#home" className="navbar-brand">
          <img
            src={zlgLogo}
            alt=""
            style={{ height: "40px" }}
            loading="lazy"
            aria-hidden="true"
          />
          <span className="visually-hidden">Zombie Lynx Gaming</span>
        </NavLink>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="bg-transparent border-0 d-flex flex-column align-items-center"
          style={{ outline: "none" }}
        >
          <i className="bi bi-list fs-1 text-white"></i>
        </button>
      </div>

      {/* BOTTOM NAV */}
      {loggedInUser && (
        <div
          className="position-fixed bottom-0 zlg-nav-bar start-0 end-0 bg-dark d-flex w-100 d-md-none pt-2 pb-2 border-top border-black"
          style={{ zIndex: 10050 }}
        >
          {/* Stats */}
          <NavLink
            to="/member/stats"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Stats"
          >
            {({ isActive }) => (
              <i
                className={`bi ${
                  isActive ? "bi-bar-chart-fill" : "bi-bar-chart"
                } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                aria-hidden="true"
              ></i>
            )}
          </NavLink>

          {/* Battle Pass */}
          <NavLink
            to="/member/battlepass"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Battle Pass"
          >
            {({ isActive }) => (
              <i
                className={`bi bi-stars fs-4 ${
                  isActive ? "text-white" : "text-secondary"
                }`}
              ></i>
            )}
          </NavLink>

          {/* Tickets */}
          <NavLink
            to="/member/tickets"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Tickets"
          >
            {({ isActive }) => (
              <i
                className={`bi ${
                  isActive ? "bi-ticket-fill" : "bi-ticket"
                } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
              ></i>
            )}
          </NavLink>

          {/* Votes */}
          <NavLink
            to="/member/vote"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Votes"
          >
            {({ isActive }) => (
              <i
                className={`bi ${
                  isActive ? "bi-check-square-fill" : "bi-check-square"
                } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
              ></i>
            )}
          </NavLink>

          {/* Notifications */}
          <NavLink
            to="/member/notifications"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Notifications"
          >
            {({ isActive }) => (
              <i
                className={`bi ${isActive ? "bi-bell-fill" : "bi-bell"} fs-4 ${
                  isActive ? "text-white" : "text-secondary"
                }`}
              ></i>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/member/settings/general"
            className="col text-center"
            style={{ minWidth: 0 }}
            aria-label="Settings"
          >
            {({ isActive }) => (
              <i
                className={`bi ${isActive ? "bi-gear-fill" : "bi-gear"} fs-4 ${
                  isActive ? "text-white" : "text-secondary"
                }`}
              ></i>
            )}
          </NavLink>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <NavBarMobileMainMenu
          loggedInUser={loggedInUser}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
