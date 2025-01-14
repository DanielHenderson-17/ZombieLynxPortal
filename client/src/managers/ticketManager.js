const _apiUrl = "/api/tickets";

// ✅ Helper: Get JWT Token from Local Storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get Open Tickets
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

// ✅ Get Closed Tickets
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

// ✅ Close a Ticket
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

// ✅ Restore a Ticket
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

// ✅ Create a New Ticket
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

// ✅ Update/Edit a Ticket
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

// ✅ Delete a Ticket
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

// ✅ Get Ticket Creation Options
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

// ✅ Get Ticket by ID
export const getTicketById = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Error fetching ticket with ID ${id}`)
  );
};

// ✅ Assign User to Ticket
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

// ✅ Get All Users (Admin Only)
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

// ✅ Edit a Ticket
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
