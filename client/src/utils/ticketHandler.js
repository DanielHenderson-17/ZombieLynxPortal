import { getMessagesByTicketId, sendMessage } from "../managers/messageManager";
import { closeTicketAPI, restoreTicketAPI } from "../managers/ticketManager";
import { toast } from "react-toastify";

// Send a message
export async function handleSendMessage(
  ticketId,
  newMessage,
  setMessages,
  setNewMessage,
  setError
) {
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
}

// Enter key handler
export function handleKeyPress(e, ticketStatus, handleSendMessage) {
  if (e.key === "Enter" && ticketStatus === "Open") {
    handleSendMessage();
  }
}

// Close ticket
export async function handleCloseTicket(ticketId, navigate) {
  try {
    await closeTicketAPI(ticketId);
    toast.success("Ticket closed. Thank you!", { autoClose: 3000 });
    setTimeout(() => {
      navigate("/member/tickets/closed-tickets");
    }, 3000);
  } catch (error) {
    console.error("Error closing ticket:", error);
    toast.error("Failed to close the ticket.");
  }
}

// Restore ticket
export async function handleRestoreTicket(ticketId, navigate) {
  try {
    await restoreTicketAPI(ticketId);
    toast.success(
      "Your ticket has been reopened. We will be with you shortly!",
      {
        autoClose: 3000,
      }
    );
    setTimeout(() => {
      navigate("/member/tickets/open-tickets");
    }, 3000);
  } catch (error) {
    console.error("Error restoring ticket:", error);
    toast.error("Failed to restore the ticket.");
  }
}

// Refresh messages
export function handleRefreshMessages(setRefreshKey) {
  setRefreshKey((prevKey) => prevKey + 1);
}
