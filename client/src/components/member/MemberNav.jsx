import { NavLink } from "react-router-dom";

export default function MemberNav({ isMobile = false, loggedInUser }) {
  const linkClass = (isActive) =>
    `text-decoration-none d-flex ${
      isMobile ? "flex-row align-items-center" : "flex-column"
    } 
         ${isMobile ? "gap-2" : ""} ${isMobile ? "mx-2" : "mb-4"} 
         ${isActive ? "text-white" : "text-secondary"}`;

  return (
    <>
      <NavLink
        to="/member/stats"
        className={({ isActive }) => `${linkClass(isActive)} mt-md-4 mt-0 mb-2`}
      >
        {({ isActive }) => (
          <div
            className={`d-flex ${
              isMobile
                ? "flex-row align-items-center gap-2"
                : "flex-column align-items-center"
            } ${isActive ? "active-icon" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient
                  id={`grad-stats-${isMobile ? "mobile" : "desktop"}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isActive ? "#a891f0" : "#9a80e4"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isActive ? "#5e6dde" : "#535ece"}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-stats-${isMobile ? "mobile" : "desktop"})`}
                d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
              />
            </svg>
            <small>Stats</small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/tickets"
        className={({ isActive }) => `${linkClass(isActive)} mb-2`}
      >
        {({ isActive }) => (
          <div
            className={`d-flex ${
              isMobile
                ? "flex-row align-items-center gap-2"
                : "flex-column align-items-center"
            } ${isActive ? "active-icon" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient
                  id={`grad-tickets-${isMobile ? "mobile" : "desktop"}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isActive ? "#a891f0" : "#7b2ff7"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isActive ? "#5e6dde" : "#4facfe"}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-tickets-${isMobile ? "mobile" : "desktop"})`}
                d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3 .5.5 0 0 0 .5-.5V4.5A1.5 1.5 0 0 0 14.5 3z"
              />
            </svg>
            <small>Tickets</small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/notifications"
        className={({ isActive }) => `${linkClass(isActive)} mb-2`}
      >
        {({ isActive }) => (
          <div
            className={`d-flex ${
              isMobile
                ? "flex-row align-items-center gap-2"
                : "flex-column align-items-center"
            } ${isActive ? "active-icon" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient
                  id={`grad-notify-${isMobile ? "mobile" : "desktop"}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isActive ? "#a891f0" : "#7b2ff7"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isActive ? "#5e6dde" : "#4facfe"}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-notify-${isMobile ? "mobile" : "desktop"})`}
                d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"
              />
            </svg>
            <small>Notifications</small>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/member/accountsettings"
        className={({ isActive }) => `${linkClass(isActive)} mb-2`}
      >
        {({ isActive }) => (
          <div
            className={`d-flex ${
              isMobile
                ? "flex-row align-items-center gap-2"
                : "flex-column align-items-center"
            } ${isActive ? "active-icon" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient
                  id={`grad-settings-${isMobile ? "mobile" : "desktop"}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isActive ? "#a891f0" : "#7b2ff7"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isActive ? "#5e6dde" : "#4facfe"}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-settings-${isMobile ? "mobile" : "desktop"})`}
                d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
              />
            </svg>
            <small>Settings</small>
          </div>
        )}
      </NavLink>
      {!isMobile && loggedInUser?.role === "Admin" && (
        <NavLink
          to="/member/admin/users"
          className={({ isActive }) => `${linkClass(isActive)} mt-1`}
        >
          {({ isActive }) => (
            <div
              className={`d-flex flex-column align-items-center ${
                isActive ? "active-icon" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
                viewBox="0 0 16 16"
              >
                <defs>
                  <linearGradient
                    id={`grad-admin-${isMobile ? "mobile" : "desktop"}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={isActive ? "#a891f0" : "#7b2ff7"}
                    />
                    <stop
                      offset="100%"
                      stopColor={isActive ? "#5e6dde" : "#4facfe"}
                    />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#grad-admin-${isMobile ? "mobile" : "desktop"})`}
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
                />
              </svg>

              <small>Admin</small>
            </div>
          )}
        </NavLink>
      )}
    </>
  );
}
