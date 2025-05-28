import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import InboxNotifications from "./InboxNotifications";
import ReadNotifications from "./ReadNotifications";
import CreateNotification from "./CreateNotification";
import NotificationsMobileNav from "./NotificationsMobileNav";
import "./Notifications.css";

export default function Notifications({ loggedInUser }) {
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);

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
      {/* Sidebar Navigation (Desktop Only) */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          {/* Create Notification Button */}
          {loggedInUser?.role === "Admin" && (
            <div>
              <Link
                to="/member/notifications/create"
                className={`d-flex justify-content-start text-decoration-none ${
                  location.pathname === "/member/notifications/create"
                    ? "active"
                    : ""
                }`}
              >
                <button className="btn btn-success d-flex justify-content-center align-items-center ps-1 pe-2 py-1">
                  <i className="bi bi-plus fs-5 text-white"></i>Create Alert
                </button>
              </Link>
              <hr className="mb-4" />
            </div>
          )}

          {/* Inbox Link */}
          <Link
            to="/member/notifications/inbox"
            className={`text-decoration-none ${
              location.pathname.includes("/member/notifications/inbox")
                ? "active"
                : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 text-white d-flex align-items-center">
              <i className="bi bi-envelope-open-fill me-3 text-white"></i>
              <p className="m-0 p-0">Inbox</p>
            </button>
          </Link>

          {/* Read Link */}
          <Link
            to="/member/notifications/read"
            className={`text-decoration-none ${
              location.pathname.includes("/member/notifications/read")
                ? "active"
                : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 text-white d-flex align-items-center">
              <i className="bi bi-archive-fill me-3 text-white"></i>
              <p className="m-0 p-0">Read</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 mb-0 ticket-main">
        <Routes>
          <Route
            path="inbox"
            element={<InboxNotifications loggedInUser={loggedInUser} />}
          />
          <Route
            path="read"
            element={<ReadNotifications loggedInUser={loggedInUser} />}
          />
          <Route
            path="create"
            element={<CreateNotification loggedInUser={loggedInUser} />}
          />
          <Route
            path=""
            element={<InboxNotifications loggedInUser={loggedInUser} />}
          />
        </Routes>
      </div>

      {/* Mobile Navigation (Admin Only) */}
      <NotificationsMobileNav loggedInUser={loggedInUser} />
    </div>
  );
}
