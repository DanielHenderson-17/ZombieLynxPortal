import { NavLink } from "react-router-dom";

export default function MemberDesktopNav({ loggedInUser }) {
  const linkClass = (isActive) =>
    `text-decoration-none d-flex flex-column align-items-center mb-4 px-3 py-2 w-100 ${
      isActive ? "text-white member-desktop-active" : "text-secondary"
    }`;

  return (
    <>
      <NavLink
        to="/member/stats"
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <div className="d-flex flex-column align-items-center">
            <i
              className={`bi ${
                isActive ? "bi-bar-chart-fill" : "bi-bar-chart"
              } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
            ></i>
            <small>
              {isActive ? (
                "Stats"
              ) : (
                <span className="text-secondary">Stats</span>
              )}
            </small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/tickets"
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <div className="d-flex flex-column align-items-center">
            <i
              className={`bi ${
                isActive ? "bi-ticket-fill" : "bi-ticket"
              } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
            ></i>
            <small>
              {isActive ? (
                "Tickets"
              ) : (
                <span className="text-secondary">Tickets</span>
              )}
            </small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/notifications"
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <div className="d-flex flex-column align-items-center">
            <i
              className={`bi ${
                isActive ? "bi-envelope-fill" : "bi-envelope"
              } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
            ></i>
            <small>
              {isActive ? (
                "Notifications"
              ) : (
                <span className="text-secondary">Notifications</span>
              )}
            </small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/vote"
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <div className="d-flex flex-column align-items-center">
            <i
              className={`bi ${
                isActive ? "bi-check-square-fill" : "bi-check-square"
              } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
            ></i>
            <small>
              {isActive ? "Vote" : <span className="text-secondary">Vote</span>}
            </small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/settings/general"
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <div className="d-flex flex-column align-items-center">
            <i
              className={`bi ${isActive ? "bi-gear-fill" : "bi-gear"} fs-4 ${
                isActive ? "text-white" : "text-secondary"
              }`}
            ></i>
            <small>
              {isActive ? (
                "Settings"
              ) : (
                <span className="text-secondary">Settings</span>
              )}
            </small>
          </div>
        )}
      </NavLink>

      {loggedInUser?.role === "Admin" && (
        <NavLink
          to="/member/admin/users"
          className={({ isActive }) => linkClass(isActive)}
        >
          {({ isActive }) => (
            <div className="d-flex flex-column align-items-center">
              <i
                className={`bi ${
                  isActive ? "bi-person-fill-gear" : "bi-person-gear"
                } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
              ></i>
              <small>
                {isActive ? (
                  "Admin"
                ) : (
                  <span className="text-secondary">Admin</span>
                )}
              </small>
            </div>
          )}
        </NavLink>
      )}
    </>
  );
}
