import { getMessagesByTicketId } from "../managers/messageManager";

export const pollMessages = (ticketId, setMessages, intervalMs = 5000) => {
  let pollingActive = true;
  let lastMessageId = null;

  const fetchMessages = async () => {
    if (!pollingActive) return;

    try {
      const newMessages = await getMessagesByTicketId(ticketId);

      if (newMessages.length === 0) {
        setMessages([]);
        return;
      }

      const latestMessage = newMessages[newMessages.length - 1];

      if (!lastMessageId || latestMessage.id > lastMessageId) {
        lastMessageId = latestMessage.id;
        setMessages(newMessages); // ✅ No scrolling here, only updating messages
      }
    } catch (error) {
      console.error("Error polling messages:", error);
    }

    setTimeout(fetchMessages, intervalMs);
  };

  fetchMessages();

  return () => {
    pollingActive = false;
  };
};
