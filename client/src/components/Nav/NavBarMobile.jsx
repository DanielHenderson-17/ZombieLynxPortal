import { NavLink } from "react-router-dom";
import { useState } from "react";
import NavBarMobileMainMenu from "./NavBarMobileMainMenu";

export default function NavBarMobile({ loggedInUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <>
      {/* TOP NAV: logo + hamburger */}
      <div
        className="position-fixed top-0 start-0 end-0 bg-dark d-flex zlg-nav-bar justify-content-between align-items-center px-3 py-2 d-md-none"
        style={{ zIndex: 10050 }}
      >
        <NavLink to="/#home" className="navbar-brand">
          <img
            src="/images/zlg-logo.png"
            alt="Zombie Lynx Gaming"
            style={{ height: "40px" }}
          />
        </NavLink>

        <div
          role="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="d-flex flex-column align-items-center"
        >
          <i className="bi bi-list fs-1 text-white"></i>
        </div>
      </div>

      {/* BOTTOM NAV: Only show if logged in */}
      {loggedInUser && (
        <div
          className="position-fixed bottom-0 zlg-nav-bar start-0 end-0 bg-dark d-flex w-100 d-md-none pt-2 pb-1"
          style={{ zIndex: 10050 }}
        >
          {/* Stats */}
          <NavLink
            to="/member/stats"
            className="col text-decoration-none text-center"
            style={{ minWidth: 0 }}
          >
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i
                  className={`bi ${
                    isActive ? "bi-bar-chart-fill" : "bi-bar-chart"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
                <small
                  className={isActive ? "text-white" : "text-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Stats
                </small>
              </div>
            )}
          </NavLink>

          {/* Tickets */}
          <NavLink
            to="/member/tickets"
            className="col text-decoration-none text-center"
            style={{ minWidth: 0 }}
          >
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i
                  className={`bi ${
                    isActive ? "bi-ticket-fill" : "bi-ticket"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
                <small
                  className={isActive ? "text-white" : "text-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Tickets
                </small>
              </div>
            )}
          </NavLink>

          {/* Vote */}
          <NavLink
            to="/member/vote"
            className="col text-decoration-none text-center"
            style={{ minWidth: 0 }}
          >
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i
                  className={`bi ${
                    isActive ? "bi-check-square-fill" : "bi-check-square"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
                <small
                  className={isActive ? "text-white" : "text-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Votes
                </small>
              </div>
            )}
          </NavLink>

          {/* Notifications */}
          <NavLink
            to="/member/notifications"
            className="col text-decoration-none text-center"
            style={{ minWidth: 0 }}
          >
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i
                  className={`bi ${
                    isActive ? "bi-envelope-fill" : "bi-envelope"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
                <small
                  className={isActive ? "text-white" : "text-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Alerts
                </small>
              </div>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/member/settings/general"
            className="col text-decoration-none text-center"
            style={{ minWidth: 0 }}
          >
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i
                  className={`bi ${
                    isActive ? "bi-gear-fill" : "bi-gear"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
                <small
                  className={isActive ? "text-white" : "text-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Settings
                </small>
              </div>
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
