import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getTicketById,
  closeTicketAPI,
  restoreTicketAPI,
  assignUserToTicket,
  getAllUsers,
} from "../../managers/ticketManager";
import {
  getMessagesByTicketId,
  sendMessage,
} from "../../managers/messageManager";
import { formatLongDateTime } from "../../utils/longDateTime";
import { renderMessageContent } from "../../utils/renderMessageContent.js";
import { formatShortDate } from "../../utils/shortDateTime";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { categoryFormatter } from "../../utils/categoryFormater";
import { getGameImage } from "../../utils/gameFormatter";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
// import { generateRandomSeed } from "../../utils/generateRandomSeed.js";
import { truncateText } from "../../utils/truncateText.js";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter.js";

export default function SingleTicket({ loggedInUser }) {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(loggedInUser.role === "Admin");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [discordAccount, setDiscordAccount] = useState(null);
  // const [randomSeed, setRandomSeed] = useState(null);

  // Fetch ticket and messages, update state as message is sent for the ticket
  // Fetch ticket, messages, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketData = await getTicketById(ticketId);
        setTicket(ticketData);

        const messageData = await getMessagesByTicketId(ticketId);
        setMessages(messageData);

        const users = await getAllUsers();
        setAllUsers(users);

        setIsAdmin(loggedInUser.role === "Admin");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch ticket details or messages.");
      }
    };

    fetchData();
  }, [ticketId, loggedInUser.role, refreshKey]);

  // Fetch Steam account and update every minute
  useEffect(() => {
    const fetchDiscordAccount = async () => {
      try {
        const updatedDiscordAccount = await getLinkedDiscordAccount();
        if (updatedDiscordAccount) {
          setDiscordAccount(updatedDiscordAccount);
        }
      } catch (error) {
        console.error("❌ Error fetching Discord account:", error);
      }
    };

    fetchDiscordAccount();
    const intervalId = setInterval(fetchDiscordAccount, 60000);

    return () => clearInterval(intervalId);
  }, [loggedInUser, refreshKey]);

  // // Generate random seed for profile images
  // useEffect(() => {
  //   setRandomSeed(generateRandomSeed());
  // }, []);

  // Send message
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

  // Send message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Close ticket
  const handleCloseTicket = async () => {
    try {
      await closeTicketAPI(ticketId);
      navigate("/member/tickets/closed-tickets");
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close the ticket. Please try again.");
    }
  };

  // Restore ticket
  const handleRestoreTicket = async () => {
    try {
      await restoreTicketAPI(ticketId);
      navigate("/member/tickets/open-tickets");
    } catch (error) {
      console.error("Error restoring ticket:", error);
      setError("Failed to restore the ticket. Please try again.");
    }
  };

  // Assign user to ticket
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

  const handleRefreshMessages = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="text-white container-fluid mt-0 pt-3 h-100">
      <div className="row single-row h-100 pb-3">
        {/* Left Column: Ticket Details */}
        <div className="col-md-4 single-details h-100 mb-3">
          <div className="d-flex pt-2">
            {/* Game Image */}
            <div className="col-4">
              <img
                className="img-fluid single-img rounded col-12"
                src={getGameImage(ticket.game)}
                alt={ticket.game}
              />
              <div className="d-flex justify-content-end">
                <small className="text-secondary fst-italic">
                  Ticket #{ticket.id}
                </small>
              </div>
            </div>

            <div className="ms-3">
              <h5 className="text-start mt-0">
                {truncateText(ticket.subject, 40)}
              </h5>
              {/* Server Name */}
              <h6 className="text-start">{truncateText(ticket.server, 20)}</h6>

              {/* Category */}
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center col-10">
                  <div
                    className="text-start me-1"
                    dangerouslySetInnerHTML={{
                      __html: categoryFormatter(ticket.category),
                    }}
                  ></div>
                  <span className="text-start">{ticket.category}</span>
                </div>
              </div>

              {/* Updated At */}
              <small className="text-secondary text-start d-block mt-2 mb-2">
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

                {isAdmin && (
                  <div className="mt-2">
                    <select
                      onChange={(e) => handleAssignUser(e.target.value)}
                      className="form-select form-select-sm"
                    >
                      <option value="">Add User</option>
                      {allUsers
                        .filter(
                          (user) =>
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
                )}
              </div>
            </div>
          </div>

          {/* <h6 className="text-start mt-0">
            {truncateText(ticket.subject, 40)}
          </h6> */}
          {/* Description */}
          <div className="text-start mt-md-2 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <small>Description:</small>
              <button
                className="btn btn-link p-0 ms-2"
                onClick={() =>
                  navigate(`/member/tickets/ticket/${ticket.id}/edit`)
                }
              >
                <small className="bi bi-pencil text-white me-2"></small>
              </button>
            </div>

            <p className="p-2 mb-0 mt-md-1 mt-0 description shadow">
              {ticket.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end mt-3 pt-0">
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
              </>
            )}
          </div>
        </div>

        {/* Right Column: Messages */}
        <div className="col-md-8 text-start mb-3 ps-md-0 ps-2 message-container">
          {!discordAccount?.discordName ? (
            // If not logged in, show a grayed-out message box
            <div className="text-muted p-3 bg-dark rounded text-center mt-5">
              <p className="text-white">
                You need to link your Discord account to send messages.
              </p>
              <p className="text-white">
                Please login and then refresh messages.
              </p>
              {/* Refresh Button */}
              <div className="d-flex justify-content-center p-2">
                <button
                  className="btn btn-secondary"
                  onClick={handleRefreshMessages}
                >
                  Refresh Messages 🔄
                </button>
              </div>
            </div>
          ) : (
            // If logged in, show the normal message UI
            <div className="shadow border-black rounded p-0 message-box">
              <div className="d-flex flex-column">
                {/* Messages Container */}
                <div className="flex-grow-1 messages mb-0 p-md-3 p-1">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className="mb-3 d-flex">
                        <img
                          src={
                            msg.discordImgUrl
                              ? msg.discordImgUrl
                              : "https://cdn.discordapp.com/embed/avatars/0.png" // Fallback avatar
                          }
                          alt="Profile"
                          className="message-img me-2"
                        />
                        <div>
                          <div className="d-flex align-items-center">
                            <strong className="me-2">
                              {capitalizeFirstLetter(
                                formatDiscordName(msg.discordUserName)
                              ) || "Unknown User"}
                            </strong>
                            <small className="text-secondary">
                              {formatShortDate(msg.createdAt)}
                            </small>
                          </div>

                          <div className="mb-0">
                            {renderMessageContent(msg.content)}

                            {/* ✅ Render Images if Present */}
                            {msg.imgUrlsJson &&
                              (typeof msg.imgUrlsJson === "string"
                                ? JSON.parse(msg.imgUrlsJson)
                                : msg.imgUrlsJson
                              )?.length > 0 && (
                                <div className="mt-2">
                                  {(typeof msg.imgUrlsJson === "string"
                                    ? JSON.parse(msg.imgUrlsJson)
                                    : msg.imgUrlsJson
                                  ).map((imageUrl, index) => (
                                    <img
                                      key={index}
                                      src={imageUrl}
                                      alt={`Attachment ${index + 1}`}
                                      className="img-fluid rounded mt-1 mx-1"
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "300px",
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
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
                    className="form-control me-2 message-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary message-button"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
