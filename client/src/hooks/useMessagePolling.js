import { useEffect } from "react";
import { pollMessages } from "../utils/pollMessages";

export function useMessagePolling(ticketId, setMessages) {
  useEffect(() => {
    if (!ticketId) return;
    const stopPolling = pollMessages(ticketId, setMessages, 10000);
    return () => stopPolling();
  }, [ticketId]);
}
