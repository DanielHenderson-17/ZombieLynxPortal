// components/member/MemberNav.jsx
import { NavLink } from "react-router-dom";

export default function MemberNav({ isMobile = false }) {
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
        className={({ isActive }) => linkClass(isActive)}
      >
        <i className="bi bi-bar-chart-fill fs-4"></i>
        <small>Stats</small>
      </NavLink>
      <NavLink
        to="/member/tickets"
        className={({ isActive }) => linkClass(isActive)}
      >
        <i className="bi bi-ticket-fill fs-4"></i>
        <small>Tickets</small>
      </NavLink>
      <NavLink
        to="/member/notifications"
        className={({ isActive }) => linkClass(isActive)}
      >
        <i className="bi bi-envelope-fill fs-4"></i>
        <small>Notifications</small>
      </NavLink>
      <NavLink
        to="/member/accountsettings"
        className={({ isActive }) => linkClass(isActive)}
      >
        <i className="bi bi-gear-fill fs-4"></i>
        <small>Settings</small>
      </NavLink>
    </>
  );
}
