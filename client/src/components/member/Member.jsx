import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Member.css";
import ProfileInfo from "./ProfileInfo.jsx";
import MemberDesktopNav from "./MemberDesktopNav.jsx";

export default function Member({ loggedInUser, setLoggedInUser }) {
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
    <div
      className={`fade-container2 member-main ${isVisible ? "fade-in" : ""}`}
    >
      <div className="d-flex px-0 member mt-md-0 mt-5">
        {/* Sidebar - desktop only */}
        <aside className="d-none d-md-flex flex-column justify-content-between align-items-center bg-dark py-2 pb-2 pt-4 member-sidebar">
          <MemberDesktopNav
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        </aside>

        {/* Main content area */}
        <div className="member-layout col h-100">
          <div className="position-relative">
            <div className="member-container mt-md-0 mt-3">
              <div className="member-header d-flex flex-column align-items-start pb-0 pt-2 pt-md-0">
                <ProfileInfo loggedInUser={loggedInUser} />
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
