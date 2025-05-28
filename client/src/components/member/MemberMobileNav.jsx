import { NavLink } from "react-router-dom";

export default function MemberMobileNav() {
  const navItems = [
    { to: "/member/stats", icon: "bar-chart", label: "Stats" },
    { to: "/member/tickets", icon: "ticket", label: "Tickets" },
    { to: "/member/vote", icon: "check-square", label: "Votes" },
    { to: "/member/notifications", icon: "bell", label: "Alerts" },
    { to: "/member/settings/general", icon: "gear", label: "Settings" },
    { to: "/member/menu", icon: "list", label: "Menu", isMenu: true },
  ];

  return (
    <div
      className="position-fixed bottom-0 start-0 end-0 bg-dark d-flex justify-content-around py-2 member-mobile-nav"
      style={{ zIndex: 1050 }}
    >
      {navItems.map(({ to, icon, isMenu }) => (
        <NavLink key={to} to={to} className="d-flex align-items-center">
          {({ isActive }) => (
            <div className="d-flex flex-column align-items-center">
              <i
                className={`bi ${
                  isActive && !isMenu ? `bi-${icon}-fill` : `bi-${icon}`
                } fs-4 ${isActive ? "text-white" : "text-secondary"}`}
              />
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}
