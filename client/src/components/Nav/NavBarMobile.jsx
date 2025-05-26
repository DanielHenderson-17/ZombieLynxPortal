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
    <div
      className="position-fixed bottom-0 start-0 end-0 bg-dark d-flex justify-content-around align-items-center pt-2 pb-1 member-mobile-nav d-md-none"
      style={{ zIndex: 10050 }}
    >
      {loggedInUser && (
        <>
          {/* Stats */}
          <NavLink to="/member/stats">
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center">
                <i
                  className={`bi ${
                    isActive ? "bi-bar-chart-fill" : "bi-bar-chart"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
              </div>
            )}
          </NavLink>

          {/* Tickets */}
          <NavLink to="/member/tickets">
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center">
                <i
                  className={`bi ${
                    isActive ? "bi-ticket-fill" : "bi-ticket"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
              </div>
            )}
          </NavLink>

          {/* Vote */}
          <NavLink to="/member/vote">
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center">
                <i
                  className={`bi ${
                    isActive ? "bi-check-square-fill" : "bi-check-square"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
              </div>
            )}
          </NavLink>

          {/* Notifications */}
          <NavLink to="/member/notifications">
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center">
                <i
                  className={`bi ${
                    isActive ? "bi-envelope-fill" : "bi-envelope"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
              </div>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink to="/member/settings/general">
            {({ isActive }) => (
              <div className="d-flex flex-column align-items-center">
                <i
                  className={`bi ${
                    isActive ? "bi-gear-fill" : "bi-gear"
                  } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
                ></i>
              </div>
            )}
          </NavLink>
        </>
      )}

      {/* Hamburger Menu */}
      <div
        role="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="d-flex flex-column align-items-center"
      >
        <i className="bi bi-list fs-1 text-white"></i>
      </div>

      {menuOpen && (
        <NavBarMobileMainMenu
          loggedInUser={loggedInUser}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
