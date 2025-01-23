const _apiUrl = "/api/Notification";

// ✅ Helper: Get JWT Token from Local Storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get Notifications for the Logged-in User
export const getUserNotifications = () => {
  return fetch(_apiUrl, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching user notifications:", error);
      throw error;
    });
};

// ✅ Create a Notification (Admin Only)
export const createNotification = (notification) => {
  console.log("Notification payload:", notification);

  return fetch(_apiUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(notification),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${error.message}`
          );
        });
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error creating notification:", error);
      throw error;
    });
};

// ✅ Mark a Notification as Read
export const markNotificationAsRead = (notificationId) => {
  return fetch(`${_apiUrl}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ notificationId }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error marking notification as read.");
      }
    })
    .catch((error) => {
      console.error("Error marking notification as read:", error);
      throw error;
    });
};

// ✅ Delete a Notification (Admin Only)
export const deleteNotification = (notificationId) => {
  return fetch(`${_apiUrl}/${notificationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error deleting notification.");
      }
    })
    .catch((error) => {
      console.error("Error deleting notification:", error);
      throw error;
    });
};

// ✅ Get All Users with User ID and Profile ID
export const getAllUsersAndId = () => {
  return fetch(`${_apiUrl}/GetAllUsersAndId`, {
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${error.message}`
          );
        });
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching all users with ID:", error);
      throw error;
    });
};
