import { formatLongDateTime } from "../../utils/longDateTime";
import { categoryFormatter } from "../../utils/categoryFormatter";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { getGameImage } from "../../utils/gameFormatter";
import { truncateText } from "../../utils/truncateText";

export default function TicketDetails({
  ticket,
  navigate,
  ticketId,
  handleCloseTicket,
  handleRestoreTicket,
}) {
  const assignedUser = ticket.assignedUsers[0];

  return (
    <div className=" ticket-box shadow">
      <div className="col-12 mb-0 position-relative d-flex p-2 rounded-top align-items-center">
        {/* Div 1 - Game Image */}
        <div className="me-2 d-flex align-items-center justify-content-center">
          <img
            src={getGameImage(ticket.game)}
            alt={ticket.game}
            className="rounded"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>

        {/* Div 2 - Info box */}
        <div className="flex-grow-1 mb-0">
          {/* Top Row - User + category + date */}
          <div className="d-flex align-items-center flex-wrap mb-0">
            <img
              src={
                assignedUser?.zlgMember?.discordImgUrl ||
                "https://cdn.discordapp.com/embed/avatars/0.png"
              }
              alt="Discord Avatar"
              className="rounded-circle me-2"
              style={{ width: "30px", height: "30px" }}
            />
            <span className="me-2">
              {formatDiscordName(assignedUser?.zlgMember?.discordName) ||
                `${assignedUser?.firstName} ${assignedUser?.lastName}`}
            </span>
            <span className="me-2 text-secondary">
              -{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: categoryFormatter(ticket.category),
                }}
              />
            </span>
            <span className="text-secondary single-ticket-date d-none d-md-inline">
              - {formatLongDateTime(ticket.updatedAt)}
            </span>
          </div>

          {/* Subject */}
          <h5 className="text-white m-0 text-start d-none d-md-block">
            {truncateText(ticket.subject, 50)}
          </h5>
          <h5 className="text-white m-0 text-start d-block d-md-none">
            {truncateText(ticket.subject, 20)}
          </h5>

          {/* Description */}
          <p className="text-light mb-0 mt-1 text-start d-none d-md-block">
            {truncateText(ticket.description, 50)}
          </p>
          <p className="text-light mb-0 mt-1 text-start d-block d-md-none">
            {truncateText(ticket.description, 20)}
          </p>

          {/* Server */}
          <p className="text-white mb-0 mt-1 text-start">
            {truncateText(ticket.server, 30)}
          </p>
        </div>

        {/* Div 3 - Close / Restore */}
        <div className="d-md-flex d-none flex-column justify-content-between align-items-end pt-0">
          {ticket.status === "Open" ? (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to close this ticket?")
                ) {
                  handleCloseTicket(ticketId, navigate);
                }
              }}
            >
              Close <i className="bi bi-x-circle ms-1"></i>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to restore this ticket?"
                  )
                ) {
                  handleRestoreTicket(ticketId, navigate);
                }
              }}
            >
              Restore <i className="bi bi-arrow-counterclockwise ms-1"></i>
            </button>
          )}

          {/* Absolute positioned Ticket ID */}
          <i className="text-secondary">
            <small>Ticket #{ticket.id}</small>
          </i>
        </div>
      </div>
      <div className="d-md-none d-block flex-column justify-content-between align-items-center col-12">
        {ticket.status === "Open" ? (
          <button
            className="btn btn-danger btn-sm col-12"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to close this ticket?")
              ) {
                handleCloseTicket(ticketId, navigate);
              }
            }}
          >
            Close <i className="bi bi-x-circle ms-1"></i>
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm col-12"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to restore this ticket?")
              ) {
                handleRestoreTicket(ticketId, navigate);
              }
            }}
          >
            Restore <i className="bi bi-arrow-counterclockwise ms-1"></i>
          </button>
        )}
      </div>
    </div>
  );
}
