import { formatShortDate } from "../../utils/shortDateTime";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { renderMessageContent } from "../../utils/renderMessageContent";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

export default function TicketMessages({
  ticket,
  messages,
  newMessage,
  setNewMessage,
  setMessages,
  discordAccount,
  setError,
  ticketId,
  handleSendMessage,
  handleKeyPress,
  handleRefreshMessages,
  setRefreshKey,
  messagesEndRef,
  showTicketDetails,
}) {
  if (!discordAccount?.discordName) {
    return (
      <div className="text-start mb-3 ps-md-0 ps-2 message-container mt-md-0 mt-1">
        <div className="text-muted p-3 bg-dark rounded text-center mt-5 messages-no-discord border">
          <p className="text-white">
            You need to link your Discord account to send messages.
          </p>
          <p className="text-white">Please login and then refresh messages.</p>
          <div className="d-flex justify-content-center p-2">
            <button
              className="btn btn-secondary"
              onClick={() => handleRefreshMessages(setRefreshKey)}
            >
              Refresh Messages 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`col-md-8 text-start mb-3 ps-md-0 message-container mt-md-0 mt-3 ${
        showTicketDetails ? "with-details" : "no-details"
      }`}
    >
      <div className="shadow border-black rounded p-0 message-box">
        <div className="d-flex flex-column message-box-inner h-100">
          <div
            ref={messagesEndRef}
            className="flex-grow-1 messages mb-0 p-md-3 p-1"
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="mb-3 d-flex">
                  <img
                    src={
                      msg.discordImgUrl ||
                      "https://cdn.discordapp.com/embed/avatars/0.png"
                    }
                    alt="Profile"
                    className="message-img me-2"
                  />
                  <div>
                    <div className="d-flex align-items-center">
                      <strong className="me-2 messages-username">
                        {capitalizeFirstLetter(
                          formatDiscordName(msg.discordUserName)
                        ) || "Unknown User"}
                      </strong>
                      <small className="text-secondary">
                        {formatShortDate(msg.createdAt)}
                      </small>
                    </div>
                    <div className="mb-0">
                      {renderMessageContent(msg.content, messages)}
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

          {ticket.status === "Open" && (
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2 message-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) =>
                  handleKeyPress(e, ticket.status, () =>
                    handleSendMessage(
                      ticketId,
                      newMessage,
                      setMessages,
                      setNewMessage,
                      setError
                    )
                  )
                }
                disabled={ticket.status !== "Open"}
              />
              <button
                className="btn btn-primary message-button"
                onClick={() =>
                  handleSendMessage(
                    ticketId,
                    newMessage,
                    setMessages,
                    setNewMessage,
                    setError
                  )
                }
                disabled={ticket.status !== "Open"}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
