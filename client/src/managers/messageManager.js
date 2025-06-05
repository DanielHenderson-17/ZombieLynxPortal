const _apiUrl = "/api/message";

/* ============================================================================
 * ✅ AUTH HEADER UTILITY
 * ========================================================================== */

/**
 * ✅ Get Authorization headers with JWT token
 * @returns {object} - Headers including Content-Type and Authorization
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================================
 * ✅ MESSAGE OPERATIONS
 * ========================================================================== */

/**
 * ✅ Get all messages for a specific ticket
 * @param {string} ticketId
 * @returns {Promise<object[]>}
 */
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

/**
 * ✅ Send a new message
 * @param {object} message - Message payload
 * @returns {Promise<object>} - Sent message data
 */
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

/**
 * ✅ Delete a message (admin only)
 * @param {string} messageId
 * @returns {Promise<void>}
 */
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

/**
 * ✅ Get message counts for the last 30 and 60 days
 * @returns {Promise<{ last30Days: number, last60Days: number }>}
 */
export const getAllMessagesCount = () => {
  return fetch(`${_apiUrl}/count`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching message counts:", error);
      throw error;
    });
};
