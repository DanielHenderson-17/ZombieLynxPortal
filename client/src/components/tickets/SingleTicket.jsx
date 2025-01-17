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
import {
  getMessagesByTicketId,
  sendMessage,
} from "../../managers/messageManager";
import { formatLongDateTime } from "../../utils/longDateTime";
import { formatShortDate } from "../../utils/shortDateTime.js";
import { categoryFormatter } from "../../utils/categoryFormater";
import { getGameImage } from "../../utils/gameFormatter";

export default function SingleTicket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketAndMessages = async () => {
      try {
        const ticketData = await getTicketById(ticketId);
        setTicket(ticketData);

        const messageData = await getMessagesByTicketId(ticketId);
        setMessages(messageData);

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
          setError("Failed to fetch ticket details or messages.");
        }
      }
    };

    fetchTicketAndMessages();
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await sendMessage({
        messageGroupId: ticketId,
        content: newMessage,
        imgUrl: null,
      });

      const updatedMessages = await getMessagesByTicketId(ticketId);
      setMessages(updatedMessages);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCloseTicket = async () => {
    try {
      await closeTicketAPI(ticketId);
      navigate("/tickets/closed-tickets");
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close the ticket. Please try again.");
    }
  };

  const handleRestoreTicket = async () => {
    try {
      await restoreTicketAPI(ticketId);
      navigate("/tickets");
    } catch (error) {
      console.error("Error restoring ticket:", error);
      setError("Failed to restore the ticket. Please try again.");
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await deleteTicket(ticketId);
      navigate("/tickets/closed-tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError("Failed to delete the ticket. Please try again.");
    }
  };

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
    <div className="text-white container-fluid mt-0 pt-3 h-100">
      <div className="row h-100 pb-3">
        {/* Left Column: Ticket Details */}
        <div className="col-md-5 h-100 mb-3">
          <div className="d-flex pt-2">
            {/* Game Image */}
            <img
              className="img-fluid single-img rounded mb-3 col-4"
              src={getGameImage(ticket.game)}
              alt={ticket.game}
            />
            <div className="ms-3">
              {/* Server Name */}
              <h6 className="text-start">{ticket.server}</h6>

              {/* Category */}
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center col-10">
                  <div
                    className="text-start"
                    dangerouslySetInnerHTML={{
                      __html: categoryFormatter(ticket.category),
                    }}
                  ></div>
                  <span className="text-start">{ticket.category}</span>
                </div>
              </div>

              {/* Updated At */}
              <small className="text-secondary text-start d-block">
                <i className="bi bi-calendar-date me-2"></i>
                {formatLongDateTime(ticket.updatedAt)}
              </small>

              {/* Assigned Users */}
              <div className="mt-1 text-start h-100">
                {ticket.assignedUsers.map((user, index) => (
                  <span key={index} className="badge bg-secondary me-2">
                    {user.firstName}
                  </span>
                ))}

                <div className="mt-2">
                  <select
                    onChange={(e) => handleAssignUser(e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="">Add User</option>
                    {allUsers
                      .filter(
                        (user) =>
                          // Exclude users already assigned
                          !ticket.assignedUsers.some(
                            (assignedUser) => assignedUser.id === user.id
                          )
                      )
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <h6 className="text-start mt-3">{ticket.subject}</h6>
          {/* Description */}
          <div className="text-start mt-5">
            <small>Description:</small>
            {isAdmin && (
              <button
                className="btn btn-link p-0 ms-2"
                onClick={() => navigate(`/tickets/ticket/${ticket.id}/edit`)}
              >
                <i className="bi bi-pencil fs-6"></i>
              </button>
            )}
            <p className="p-0 mt-2 mb-0 mt-100 description">
              {ticket.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end mt-2">
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
                  Delete <i className="bi bi-trash3 ms-2"></i>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Messages */}
        <div className="col-md-7 text-start mb-3 ps-0">
          <div
            className=" p-3"
            style={{ backgroundColor: "#1f1f1f", height: "100%" }}
          >
            <div className="d-flex flex-column h-100">
              {/* Messages Container */}
              <div className="flex-grow-1 messages mb-3">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                      <div className="d-flex align-items-center">
                        <strong className="me-2">{msg.user.firstName}</strong>
                        <small className="d-block text-secondary single-datetime">
                          {formatShortDate(msg.createdAt)}
                        </small>
                      </div>
                      {msg.content}
                    </div>
                  ))
                ) : (
                  <p>No messages yet.</p>
                )}
              </div>
              {/* Input and Send Button */}
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
