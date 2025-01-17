const _apiUrl = "/api/message";

// ✅ Helper: Get JWT Token from Local Storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get All Messages for a Specific Ticket
export const getMessagesByTicketId = (ticketId) => {
  return fetch(`${_apiUrl}/ticket/${ticketId}`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error(
        `Error fetching messages for Ticket ID ${ticketId}:`,
        error
      );
      throw error;
    });
};

// ✅ Send a New Message
export const sendMessage = (message) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(message),
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
      console.error("Error sending message:", error);
      throw error;
    });
};

// ✅ Delete a Message (Admin Only)
export const deleteMessage = (messageId) => {
  return fetch(`${_apiUrl}/${messageId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error deleting message with ID ${messageId}`);
      }
    })
    .catch((error) => {
      console.error(`Error deleting message with ID ${messageId}:`, error);
      throw error;
    });
};
