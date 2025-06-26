import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ArkSEStats from "./ASE/ArkSEStats";
import ArkSAStats from "./ArkSAStats";
import MinecraftStats from "./MinecraftStats";
import RustStats from "./RustStats";
import StatsMobileNav from "./StatsMobileNav";
import { getStatsNavIcons } from "../../utils/statsNavIcons";
import "./Stats.css";

export default function Stats({ loggedInUser }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const icons = getStatsNavIcons();

  const navLinks = [
    {
      path: "arkse",
      label: "Ark:SE",
      icon: icons.arkse,
      active: location.pathname.includes("/member/stats/arkse"),
    },
    {
      path: "arksa",
      label: "Ark:SA",
      icon: icons.arksa,
      active: location.pathname.includes("/member/stats/arksa"),
    },
    {
      path: "minecraft",
      label: "Minecraft",
      icon: icons.minecraft,
      active: location.pathname.includes("/member/stats/minecraft"),
    },
    {
      path: "rust",
      label: "Rust",
      icon: icons.rust,
      active: location.pathname.includes("/member/stats/rust"),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`d-flex flex-column flex-lg-row fade-container settings-container text-white ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          {navLinks.map(({ path, label, icon, active }) => (
            <Link
              key={path}
              to={`/member/stats/${path}`}
              className={`text-decoration-none ${active ? "active" : ""}`}
            >
              <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
                <img
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                  className="me-3"
                  loading="lazy"
                  aria-hidden="true"
                />
                <p
                  className={`m-0 p-0 ${
                    active ? "text-white" : "text-secondary"
                  }`}
                >
                  {label}
                </p>
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 mb-0 ticket-main">
        <Routes>
          <Route
            path="arkse"
            element={<ArkSEStats loggedInUser={loggedInUser} />}
          />
          <Route
            path="arksa"
            element={<ArkSAStats loggedInUser={loggedInUser} />}
          />
          <Route
            path="minecraft"
            element={<MinecraftStats loggedInUser={loggedInUser} />}
          />
          <Route
            path="rust"
            element={<RustStats loggedInUser={loggedInUser} />}
          />
          <Route path="" element={<ArkSEStats loggedInUser={loggedInUser} />} />
        </Routes>
      </div>

      <StatsMobileNav />
    </div>
  );
}
