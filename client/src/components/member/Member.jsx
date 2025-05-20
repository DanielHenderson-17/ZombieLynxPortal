import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Member.css";
import ProfileInfo from "./ProfileInfo.jsx";
import MemberNav from "./MemberNav";

export default function Member({ loggedInUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/member") {
      navigate("tickets");
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return (
    <div className={`fade-container ${isVisible ? "fade-in" : ""}`}>
      <div className="d-flex px-0 mt-md-5 mt-3 member">
        {/* Sidebar - desktop only */}
        <aside
          className="d-none d-md-flex flex-column align-items-center bg-dark py-4 pb-2 pt-5 member-sidebar"
          style={{ minWidth: "120px", maxWidth: "160px" }}
        >
          <MemberNav loggedInUser={loggedInUser} />
        </aside>

        {/* Main content area */}
        <div className="member-layout col px-3 mt-5 h-100">
          <div className="position-relative">
            <div className="member-container mt-md-0 mt-5 rounded-top-2">
              <div className="member-header d-flex flex-column align-items-start pb-0">
                <ProfileInfo loggedInUser={loggedInUser} />

                {/* Horizontal nav - mobile only */}
                <div className="d-flex d-md-none justify-content-around w-100 mt-3">
                  <MemberNav isMobile={true} loggedInUser={loggedInUser} />
                </div>
              </div>
            </div>
          </div>

          <div className="member-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
