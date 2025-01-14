const _apiUrl = "/api/tickets";

export const getOpenTickets = () => {
  return fetch(`${_apiUrl}/open`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching open tickets:", error);
      throw error;
    });
};

export const getClosedTickets = () => {
  return fetch(`${_apiUrl}/closed`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching closed tickets:", error);
      throw error;
    });
};

export const closeTicketAPI = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}/close`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const restoreTicketAPI = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}/restore`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createTicket = (ticket) => {
  console.log("Payload being sent:", ticket);
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

export const updateTicket = (ticket) => {
  return fetch(`${_apiUrl}/${ticket.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });
};

export const deleteTicket = (ticketId) => {
  return fetch(`${_apiUrl}/${ticketId}`, {
    method: "DELETE",
  });
};

export const getTicketOptions = () => {
  return fetch(`${_apiUrl}/options`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching ticket options: ${res.statusText}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching ticket options:", error);
      throw error;
    });
};

export const getTicketById = async (id) => {
  const response = await fetch(`${_apiUrl}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching ticket with ID ${id}`);
  }
  return response.json();
};

export const assignUserToTicket = (ticketId, userId) => {
  return fetch(`${_apiUrl}/${ticketId}/assign-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userId),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Error assigning user: ${res.statusText}`);
    }
  });
};

export const getAllUsers = () => {
  return fetch(`${_apiUrl}/users`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching users: ${res.statusText}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      throw error;
    });
};

export const editTicket = (ticketId, updatedTicket) => {
  return fetch(`${_apiUrl}/${ticketId}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTicket),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(
          `Error editing ticket: ${res.status}, message: ${error.message}`
        );
      });
    }

    // Handle 204 No Content response
    if (res.status === 204) {
      return null;
    }

    return res.json();
  });
};
