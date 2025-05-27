import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  markNotificationAsRead,
  deleteNotification,
  getUserNotifications,
} from "../../managers/notificationManager";
import "./Notifications.css";

export default function InboxNotifications({ loggedInUser }) {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      const unreadOnly = data.filter((n) => !n.isRead);
      setNotifications(unreadOnly);
    } catch (error) {
      toast.error("Error fetching inbox notifications.");
      console.error(error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
      toast.success("Marked as read.");
    } catch (error) {
      toast.error("Error marking as read.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
      toast.success("Deleted notification.");
    } catch (error) {
      toast.error("Error deleting notification.");
      console.error(error);
    }
  };

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-1 pt-0 px-3`}
    >
      <h3 className="text-white text-start facebook-header mb-3 d-none d-md-block">
        Inbox
      </h3>
      {notifications.length === 0 ? (
        <p className="pt-5 text-white">You have no unread notifications.</p>
      ) : (
        <ul className="list-unstyled mb-5 mt-2 mt-md-0">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="list-group-item single-notification mb-2 rounded-2 shadow py-0 d-flex justify-content-between"
            >
              <div className="text-start ms-md-3 ms-1 p-1 col-md-10 col-8">
                {n.subject && <strong>{n.subject}</strong>}
                <p className="my-1">
                  <small>{n.message}</small>
                </p>
                <small>
                  <i>{new Date(n.createdAt).toLocaleString()}</i>
                </small>
              </div>
              <div className="my-auto">
                <button
                  className="btn btn-primary me-2 px-2 py-1"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <i className="bi bi-check-lg"></i>
                </button>
                {loggedInUser?.role === "Admin" && (
                  <button
                    className="btn btn-danger me-3 px-2 py-1"
                    onClick={() => handleDelete(n.id)}
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
    </div>
  );
}
