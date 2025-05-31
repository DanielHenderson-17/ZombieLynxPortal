import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import AdminPanelMobileNav from "./AdminPanelMobileNav";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

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
      {/* Sidebar Navigation (Desktop) */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          <Link
            to="/member/admin/users"
            className={`text-decoration-none ${
              location.pathname.includes("/member/admin/users") ? "active" : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 text-white d-flex align-items-center">
              <i className="bi bi-people-fill me-3 text-white"></i>
              <p className="m-0 p-0">Users</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 mb-0 ticket-main">
        <Outlet />
      </div>

      {/* Mobile Nav */}
      <AdminPanelMobileNav />
    </div>
  );
}
