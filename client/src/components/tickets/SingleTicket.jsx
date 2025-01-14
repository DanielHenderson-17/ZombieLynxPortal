import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getTicketById,
  closeTicketAPI,
  restoreTicketAPI,
  deleteTicket,
  assignUserToTicket,
  getAllUsers,
} from "../../managers/ticketManager";
import { formatLongDateTime } from "../../utils/longDateTime";
import { categoryFormatter } from "../../utils/categoryFormater";
import { getGameImage } from "../../utils/gameFormatter";

export default function SingleTicket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the ticket details and check if the user is an admin
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);

        // Check if the user is an admin by attempting to fetch the list of all users
        const users = await getAllUsers();
        setAllUsers(users);
        setIsAdmin(true);
      } catch (error) {
        if (error.message.includes("403")) {
          console.warn(
            "User is not an admin, admin-specific features disabled."
          );
        } else {
          console.error("Error fetching data:", error);
          setError("Failed to fetch ticket details.");
        }
      }
    };

    console.log("Ticket ID:", ticketId);

    fetchTicket();
  }, [ticketId]);

  // Close the ticket
  const handleCloseTicket = async () => {
    try {
      await closeTicketAPI(ticketId);
      navigate("/tickets/closed-tickets");
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close the ticket. Please try again.");
    }
  };

  // Restore the ticket
  const handleRestoreTicket = async () => {
    try {
      await restoreTicketAPI(ticketId);
      navigate("/tickets");
    } catch (error) {
      console.error("Error restoring ticket:", error);
      setError("Failed to restore the ticket. Please try again.");
    }
  };

  // Delete the ticket
  const handleDeleteTicket = async () => {
    try {
      await deleteTicket(ticketId);
      navigate("/tickets/closed-tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError("Failed to delete the ticket. Please try again.");
    }
  };

  // Assign user to the ticket
  const handleAssignUser = async (userId) => {
    try {
      await assignUserToTicket(ticketId, userId);
      const updatedTicket = await getTicketById(ticketId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error("Error assigning user to ticket:", error);
      setError("Failed to assign user.");
    }
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="text-white col-md-6 col-11 mx-auto mt-5 pt-3">
      <h2 className="text-start mb-1 subject-font">{ticket.subject}</h2>
      <div className="d-md-flex d-block justify-content-between mb-1">
        <div className="d-flex align-items-center fs-5">
          <div
            className="me-2"
            dangerouslySetInnerHTML={{
              __html: categoryFormatter(ticket.category),
            }}
          ></div>
          {ticket.category}
        </div>
        <div className="d-flex align-items-center">
          <img
            className="gameImg me-2"
            src={getGameImage(ticket.game)}
            alt=""
          />{" "}
          {ticket.server}
        </div>
      </div>
      <small
        className="text-start d-block mb-3 ms-1"
        style={{ fontSize: "0.7rem" }}
      >
        <i className="bi bi-calendar-date me-2"></i>
        {formatLongDateTime(ticket.updatedAt)}
      </small>
      <div className="text-start">
        <strong className="text-start">
          Description:
          {isAdmin && (
            <button
              className="btn btn-link p-0 ms-2"
              onClick={() => navigate(`/tickets/ticket/${ticket.id}/edit`)}
            >
              <i className="bi bi-pencil fs-6"></i>
            </button>
          )}
        </strong>{" "}
        <p className="border rounded-2 p-3 mt-2">{ticket.description}</p>
      </div>
      <div className="row">
        <div className="col-12 col-md-7 d-flex align-items-center">
          <div className="text-start col-8 col-md-5 d-flex">
            {ticket.assignedUsers.map((user, index) => (
              <div key={`${user.firstName}-${user.lastName}`} className="me-2">
                {user.firstName}
                {index < ticket.assignedUsers.length - 1 && ","}
              </div>
            ))}
          </div>
          {isAdmin && (
            <div className="d-flex align-items-center ms-3 mt-0 col-4 col-md-7">
              <i className="bi bi-person-plus me-2"></i>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle btn-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Add User
                </button>
                <ul className="dropdown-menu">
                  {allUsers.length > 0 ? (
                    allUsers
                      .filter(
                        (user) =>
                          !ticket.assignedUsers.some(
                            (assigned) =>
                              `${assigned.firstName} ${assigned.lastName}` ===
                              user.fullName
                          )
                      )
                      .map((user) => (
                        <li key={ticket.id}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleAssignUser(user.id)}
                          >
                            {user.fullName}
                          </button>
                        </li>
                      ))
                  ) : (
                    <li>
                      <span className="dropdown-item">No users available</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-5 d-flex justify-content-end mt-4 mt-md-0">
          {ticket.status === "Open" ? (
            <button className="btn btn-danger" onClick={handleCloseTicket}>
              Close <i className="bi bi-x-circle ms-2"></i>
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={handleRestoreTicket}
              >
                Restore <i className="bi bi-arrow-counterclockwise ms-2"></i>
              </button>
              <button className="btn btn-danger" onClick={handleDeleteTicket}>
                Delete<i className="bi bi-trash3 ms-2"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
