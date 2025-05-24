import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../managers/notificationManager";
import "./Notifications.css";
import NotificationsMobileNav from "./NotificationsMobileNav";

export default function Notification({ loggedInUser }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      const sortedData = data.sort(
        (a, b) => Number(a.isRead) - Number(b.isRead)
      );
      setNotifications(sortedData);
    } catch (error) {
      toast.error("Error fetching notifications.");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
      localStorage.setItem("zlg-notifications-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "zlg-notifications-updated",
          newValue: Date.now().toString(),
        })
      );
      toast.success("Marked as read.");
    } catch (error) {
      toast.error("Error marking as read.");
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted.");
      fetchNotifications();
    } catch (error) {
      toast.error("Error deleting notification.");
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div
      className={`notifications-container fade-container ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-1 pt-0 px-3`}
    >
      <div className="d-md-flex d-none justify-content-between align-items-center mb-4">
        <h3 className="text-white facebook-header m-0 mt-2 ms-1 d-none d-md-block">
          Notifications
        </h3>
        {loggedInUser?.role === "Admin" && (
          <button
            className="btn btn-success d-flex justify-content-center align-items-center mt-2 me-1"
            style={{ width: "38px", height: "38px" }}
            onClick={() => navigate("/member/notifications/create")}
          >
            <i className="bi bi-plus fs-5 text-white"></i>
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="pt-5 text-white no-notifications">
          You currently do not have any notifications.
        </p>
      ) : (
        <ul className="list-unstyled pb-5 mb-5">
          <h3 className="text-white m-0 facebook-header text-start my-2 d-md-none d-block">
            Notifications
          </h3>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`list-group-item single-notification mb-2 rounded-2 shadow py-0 d-flex justify-content-between ${
                notification.isRead ? "isRead" : ""
              }`}
            >
              <div className="text-start ms-md-3 ms-1 p-1 col-md-10 col-8">
                {notification.subject && (
                  <strong className="mb-0">{notification.subject}</strong>
                )}
                <p className="my-1">
                  <small>{notification.message}</small>
                </p>
                <small>
                  <i className="mt-2 mb-0">
                    {new Date(notification.createdAt).toLocaleString()}
                  </i>
                </small>
              </div>
              <div className="my-auto">
                {!notification.isRead && (
                  <button
                    className="btn btn-primary me-2 px-1 py-0 px-md-3 py-md-1 text-white align-self-center my-auto"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <i className="bi bi-check-lg"></i>
                  </button>
                )}
                {loggedInUser?.role === "Admin" && (
                  <button
                    className="btn btn-danger me-3 px-1 py-0 px-md-3 py-md-1"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
      {loggedInUser?.role === "Admin" && (
        <NotificationsMobileNav loggedInUser={loggedInUser} />
      )}
    </div>
  );
}
