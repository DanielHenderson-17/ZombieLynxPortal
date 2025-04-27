import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../managers/notificationManager";
import "../../assets/styles/notifications.css";

export default function Notification({ loggedInUser }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch notifications for the logged-in user and sort them by isRead status (unread notifications first)
  useEffect(() => {
    fetchNotifications();
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
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark notification as read by ID and refetch notifications to update the UI with the new status
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
      // 👇 Notify NavBar to refresh
      localStorage.setItem("zlg-notifications-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "zlg-notifications-updated",
          newValue: Date.now().toString(),
        })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ✅ Delete a notification (Admin only) by ID and refetch notifications to update the UI with the new status
  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notifications-container pt-5 px-3">
      {loggedInUser?.role === "Admin" && (
        <div className="d-flex justify-content-end">
          <button
            className="create-notification-btn d-flex align-items-center mb-4 p-2 rounded-2 border-0 btn btn-success"
            onClick={() => navigate("/member/notifications/create")}
          >
            <i className="bi bi-plus"></i>
            <p className="m-0 p-0">Create Notification</p>
          </button>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="pt-5 text-white no-notifications">
          You currently do not have any notifications.
        </p>
      ) : (
        <ul className="list-unstyled">
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
    </div>
  );
}
