const _apiUrl = "/api/tickets";

/* ============================================================================
 * ✅ AUTH HEADER UTILITY
 * ========================================================================== */

/**
 * ✅ Get Authorization headers with JWT token
 * @returns {object}
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================================
 * ✅ TICKET FETCHING
 * ========================================================================== */

/**
 * ✅ Get open tickets
 * @returns {Promise<object[]>}
 */
export const getOpenTickets = () => {
  return fetch(`${_apiUrl}/open`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching open tickets:", error);
      throw error;
    });
};

/**
 * ✅ Get closed tickets
 * @returns {Promise<object[]>}
 */
export const getClosedTickets = () => {
  return fetch(`${_apiUrl}/closed`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching closed tickets:", error);
      throw error;
    });
};

/**
 * ✅ Get ticket by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getTicketById = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Error fetching ticket with ID ${id}`)
  );
};

/**
 * ✅ Get ticket creation options (categories, games, servers)
 * @returns {Promise<object>}
 */
export const getTicketOptions = () => {
  return fetch(`${_apiUrl}/options`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching ticket options:", error);
      throw error;
    });
};

/**
 * ✅ Get all users (admin only)
 * @returns {Promise<object[]>}
 */
export const getAllUsers = () => {
  return fetch(`${_apiUrl}/users`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching users:", error);
      throw error;
    });
};

/* ============================================================================
 * ✅ TICKET ACTIONS
 * ========================================================================== */

/**
 * ✅ Create a new ticket
 * @param {object} ticket
 * @returns {Promise<object>}
 */
export const createTicket = (ticket) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ticket),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${error.message}`
        );
      });
    }
    return res.json();
  });
};

/**
 * ✅ Update ticket (basic)
 * @param {object} ticket
 * @returns {Promise<void>}
 */
export const updateTicket = (ticket) => {
  return fetch(`${_apiUrl}/${ticket.id}/edit`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(ticket),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error updating ticket.");
    }
  });
};

/**
 * ✅ Edit a ticket (full response)
 * @param {string} ticketId
 * @param {object} updatedTicket
 * @returns {Promise<object>}
 */
export const editTicket = (ticketId, updatedTicket) => {
  return fetch(`${_apiUrl}/${ticketId}/edit`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedTicket),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(
          `Error editing ticket: ${res.status}, message: ${error.message}`
        );
      });
    }
    return res.json();
  });
};

/**
 * ✅ Close a ticket
 * @param {string} ticketId
 * @returns {Promise<void>}
 */
export const closeTicketAPI = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}/close`, {
    method: "PUT",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error closing ticket.");
    }
  });
};

/**
 * ✅ Restore a closed ticket
 * @param {string} ticketId
 * @returns {Promise<void>}
 */
export const restoreTicketAPI = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}/restore`, {
    method: "PUT",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error restoring ticket.");
    }
  });
};

/**
 * ✅ Delete a ticket
 * @param {string} ticketId
 * @returns {Promise<void>}
 */
export const deleteTicket = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error deleting ticket.");
    }
  });
};

/**
 * ✅ Assign a user to a ticket
 * @param {string} ticketId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const assignUserToTicket = (ticketId, userId) => {
  return fetch(`${_apiUrl}/${ticketId}/assign-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userId),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Error assigning user: ${res.statusText}`);
    }
  });
};
