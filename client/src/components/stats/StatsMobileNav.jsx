import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function StatsMobileNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navLinks = [
    {
      path: "/member/stats/arkse",
      label: "Ark:SE",
      icon: "/ase-logo.webp",
      active: location.pathname.includes("/member/stats/arkse"),
    },
    {
      path: "/member/stats/arksa",
      label: "Ark:SA",
      icon: "/asa-logo.webp",
      active: location.pathname.includes("/member/stats/arksa"),
    },
    {
      path: "/member/stats/minecraft",
      label: "Minecraft",
      icon: "/minecraft-logo.avif",
      active: location.pathname.includes("/member/stats/minecraft"),
    },
    {
      path: "/member/stats/rust",
      label: "Rust",
      icon: "/rust-logo.svg",
      active: location.pathname.includes("/member/stats/rust"),
    },
  ];

  return (
    <div
      className={`d-lg-none position-fixed ticket-float-nav py-2 px-2 bg-dark rounded-end-0 rounded-3 shadow ${
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

      {navLinks.map(({ path, label, icon, active }) => (
        <Link
          key={path}
          to={path}
          className={`text-decoration-none d-flex flex-column align-items-center mb-2 ${
            active ? "text-white fs-1" : "text-secondary"
          }`}
        >
          <img
            src={icon}
            alt={label}
            width={28}
            height={28}
            style={{
              filter: active ? "none" : "grayscale(100%) brightness(60%)",
            }}
          />
          <small className="ticket-mobile-nav-title">{label}</small>
        </Link>
      ))}
    </div>
  );
}
