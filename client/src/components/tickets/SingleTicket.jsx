import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import TicketDetails from "./TicketDetails";
import TicketMessages from "./TicketMessages";
import { useMessagePolling } from "../../hooks/useMessagePolling";
import { useAutoScrollToBottom } from "../../hooks/useAutoScrollToBottom.js";
import { getTicketById } from "../../managers/ticketManager";
import { getMessagesByTicketId } from "../../managers/messageManager";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
import {
  handleSendMessage,
  handleKeyPress,
  handleCloseTicket,
  handleRestoreTicket,
  handleRefreshMessages,
} from "../../utils/ticketHandler.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SingleTicket({ loggedInUser }) {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [discordAccount, setDiscordAccount] = useState(null);
  const messagesEndRef = useRef(null);
  const [showTicketDetails, setShowTicketDetails] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ticketData, messageData, discordData] = await Promise.all([
          getTicketById(ticketId),
          getMessagesByTicketId(ticketId),
          getLinkedDiscordAccount(),
        ]);

        setTicket(ticketData);
        setMessages(messageData);
        if (discordData) {
          setDiscordAccount(discordData);
        }
      } catch (error) {
        console.error("❌ Error fetching ticket/messages/Discord:", error);
        setError("Failed to fetch ticket, messages, or Discord info.");
      }
    };

    fetchAll();
    const intervalId = setInterval(fetchAll, 60000);

    return () => clearInterval(intervalId);
  }, [ticketId, loggedInUser.role, refreshKey]);

  useMessagePolling(ticketId, setMessages);
  useAutoScrollToBottom(messagesEndRef, [messages]);

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="text-white container-fluid mt-0 pt-3 h-100 px-1">
      <div className="pb-2 h-100">
        {/* Toggleable Ticket Details */}
        <div
          className={`ticket-details-wrapper ${
            showTicketDetails ? "slide-down" : "slide-up"
          }`}
        >
          <TicketDetails
            ticket={ticket}
            ticketId={ticketId}
            navigate={navigate}
            handleCloseTicket={handleCloseTicket}
            handleRestoreTicket={handleRestoreTicket}
            showTicketDetails={showTicketDetails}
            setShowTicketDetails={setShowTicketDetails}
          />
        </div>

        {/* Arrow toggle button */}
        <div className="d-flex justify-content-center mb-2 ticket-details-arrow">
          <button
            className="toggle-arrow py-0 px-1 col-12 rounded-0"
            onClick={() => setShowTicketDetails((prev) => !prev)}
          >
            <i
              className={`bi ${
                showTicketDetails ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </button>
        </div>

        {/* Ticket Messages */}
        <TicketMessages
          ticket={ticket}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setMessages={setMessages}
          discordAccount={discordAccount}
          setError={setError}
          ticketId={ticketId}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          handleRefreshMessages={handleRefreshMessages}
          setRefreshKey={setRefreshKey}
          messagesEndRef={messagesEndRef}
          showTicketDetails={showTicketDetails}
        />
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        style={{ zIndex: "10000" }}
      />
    </div>
  );
}
