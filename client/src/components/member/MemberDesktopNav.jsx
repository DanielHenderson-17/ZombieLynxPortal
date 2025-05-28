import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Member.css";
import { logout } from "../../managers/authManager";

export default function MemberDesktopNav({ loggedInUser, setLoggedInUser }) {
  const [lockedOpen, setLockedOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate("/");
    });
  };

  const linkClass = (isActive) =>
    `member-desktop-link text-decoration-none d-flex align-items-center mb-4 px-3 py-2 w-100 ${
      isActive ? "text-white member-desktop-active" : "text-secondary"
    }`;

  const logoClass =
    "member-desktop-link text-decoration-none d-flex align-items-center mb-4 px-2 py-2 w-100 text-secondary";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        setLockedOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/member/stats", icon: "bar-chart", label: "Stats" },
    { to: "/member/tickets", icon: "ticket", label: "Tickets" },
    { to: "/member/notifications", icon: "bell", label: "Alerts" },
    { to: "/member/vote", icon: "check-square", label: "Votes" },
    { to: "/member/settings/general", icon: "gear", label: "Settings" },
    ...(loggedInUser?.role === "Admin"
      ? [
          {
            to: "/member/admin/users",
            icon: "person-gear",
            fillIcon: "person-fill-gear", // explicitly fix icon here
            label: "Admin",
          },
        ]
      : []),
  ];

  return (
    <div className="member-nav-container position-relative">
      {/* Sidebar */}
      <div
        ref={wrapperRef}
        className={`member-desktop-wrapper d-flex flex-column align-items-center justify-content-between ${
          lockedOpen ? "locked" : ""
        }`}
      >
        <NavLink to="/" className={logoClass}>
          <>
            <img src="/zlgico.png" alt="" style={{ width: "40px" }} />
            <span className="member-desktop-label ms-2">Home</span>
          </>
        </NavLink>

        <div className="member-desktop-nav">
          {navItems.map(({ to, icon, fillIcon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setLockedOpen(true)}
              className={({ isActive }) => linkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <i
                    className={`bi ${
                      isActive
                        ? `bi-${fillIcon || `${icon}-fill`}`
                        : `bi-${icon}`
                    } fs-4`}
                  />
                  <span className="member-desktop-label ms-2">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Menu button */}
        <div
          className="member-desktop-link d-flex align-items-center mb-2 px-3 py-2 w-100 text-secondary"
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setLockedOpen(true);
          }}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-list fs-4" />
          <span className="member-desktop-label ms-2">Menu</span>
        </div>
      </div>

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`hamburger-slideout text-start ${menuOpen ? "open" : ""}`}
      >
        <div className="p-3 text-white d-flex flex-column">
          <Link
            to="/shop"
            className="d-flex align-items-center mb-3 text-decoration-none text-white"
          >
            <i className="bi bi-cart fs-5 me-3" />
            <span>Shop</span>
          </Link>

          <Link
            to="/zlg-rules"
            className="d-flex align-items-center mb-3 text-decoration-none text-white"
          >
            <i className="bi bi-journal-text fs-5 me-3" />
            <span>Rules</span>
          </Link>

          <Link
            to="/discord"
            className="d-flex align-items-center mb-3 text-decoration-none text-white"
          >
            <i className="bi bi-discord fs-5 me-3" />
            <span>Discord</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-danger mt-2 d-flex align-items-center justify-content-start"
            style={{ width: "100%" }}
          >
            <i className="bi bi-box-arrow-right fs-5 me-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
