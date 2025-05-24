import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getClosedTickets,
  restoreTicketAPI,
} from "../../managers/ticketManager";
import { truncateText } from "../../utils/truncateText";
import { getGameImage } from "../../utils/gameFormatter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { categoryFormatter } from "../../utils/categoryFormatter";

export default function ClosedTickets({ onTicketChange }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const data = await getClosedTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching closed tickets:", error);
      setError("Failed to fetch closed tickets. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  // Fetch closed tickets on component mount
  useEffect(() => {
    fetchTickets();
    const timeout = setTimeout(() => {
      if (fetching) {
        setLoading(true);
      }
    }, 1000);

    // Cleanup timeout if fetching finishes before timeout
    return () => clearTimeout(timeout);
  }, [fetching]);

  const handleRestoreTicket = async (ticketId) => {
    try {
      await restoreTicketAPI(ticketId);
      toast.success("Ticket reopened.", { autoClose: 3000 });

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
      onTicketChange();
    } catch (error) {
      console.error("Error restoring ticket:", error);
      toast.error("Failed to restore the ticket.");
    }
  };

  // Handle ticket click and navigate to ticket details
  const handleTicketClick = (ticketId) => {
    navigate(`/member/tickets/ticket/${ticketId}`);
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (loading) {
    return <p className="mt-5 text-white">Loading tickets...</p>;
  }

  if (fetching) {
    return null;
  }

  return (
    <div className="col-12 h-100 ticket-body1 border border-0">
      <div
        className="d-md-none d-flex justify-content-between align-items-center px-3 py-2 m-0"
        style={{ minHeight: "3rem" }}
      >
        {showSearch ? (
          <>
            <input
              type="text"
              className="form-control form-control-sm p-1 me-2"
              placeholder="Search closed tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <i
              className="bi bi-x fs-5 text-white"
              role="button"
              onClick={() => {
                setShowSearch(false);
                setSearchTerm("");
              }}
            ></i>
          </>
        ) : (
          <>
            <h3 className="text-white m-0 facebook-header">Closed Tickets</h3>
            <i
              className="bi bi-search fs-5 text-white"
              role="button"
              onClick={() => setShowSearch(true)}
            ></i>
          </>
        )}
      </div>

      {tickets.length === 0 ? (
        <p className="mt-5 text-white">You have no tickets yet!</p>
      ) : (
        <table className="table table-dark table-striped align-middle">
          <thead className="thead-dark ticket-header">
            <tr className="d-none d-lg-table-row">
              <th className="text-center col-1 d-none d-lg-table-cell">Game</th>
              <th className="text-start col-md-4 col-1 ticket-topic-title">
                Topic
              </th>

              <th className="text-start col-5 d-none d-lg-table-cell">
                Server
              </th>
              <th className="text-end col-2 pe-3">Options</th>
            </tr>
          </thead>
          <tbody>
            {tickets
              .filter((ticket) => {
                const term = searchTerm.toLowerCase();
                return (
                  ticket.subject?.toLowerCase().includes(term) ||
                  ticket.description?.toLowerCase().includes(term) ||
                  ticket.server?.toLowerCase().includes(term) ||
                  ticket.game?.toLowerCase().includes(term) ||
                  ticket.category?.toLowerCase().includes(term) ||
                  ticket.id.toString().includes(term) ||
                  ticket.assignedUsers.some((user) =>
                    `${user.zlgMember?.discordName || ""} ${
                      user.firstName || ""
                    } ${user.lastName || ""}`
                      .toLowerCase()
                      .includes(term)
                  )
                );
              })
              .slice()
              .reverse()
              .map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket.id)}
                  style={{ cursor: "pointer" }}
                  className="border border-light"
                >
                  <td className="text-center d-lg-table-cell single-ticket col-1 p-0 border-0">
                    <img
                      className="gameImg3 ms-1"
                      src={getGameImage(ticket.game)}
                      alt=""
                    />
                  </td>
                  <td className="text-start col-md-4 col-2 p-0 pt-1 border-0">
                    <div className="ticket-topic">
                      <div className="d-flex flex-wrap gap-2">
                        {ticket.assignedUsers.map((user, index) => (
                          <div
                            key={index}
                            className="d-flex flex-column align-items-start rounded"
                            style={{ fontSize: "0.85rem" }}
                          >
                            <span className="d-flex align-items-center">
                              <img
                                src={
                                  user.zlgMember?.discordImgUrl ||
                                  "https://cdn.discordapp.com/embed/avatars/0.png"
                                }
                                alt="Avatar"
                                className="me-2 rounded-circle"
                                style={{ width: "30px", height: "30px" }}
                              />
                              <span className="me-1">
                                {formatDiscordName(
                                  user.zlgMember?.discordName
                                ) || `${user.firstName} ${user.lastName}`}
                              </span>
                              <span className="text-secondary">
                                -{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: categoryFormatter(ticket.category),
                                  }}
                                ></span>
                                -{" "}
                                <small className="sub-text d-none d-md-inline">
                                  {new Date(ticket.createdAt).toLocaleString()}
                                </small>
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="d-md-none d-flex">
                        <small>{truncateText(ticket.server, 20)}</small>
                      </div>
                      <strong className="text-white">
                        {truncateText(ticket.subject, 20)}
                      </strong>

                      <div className="d-none d-md-flex m-0 p-0">
                        <strong className="sub-text col-12">
                          {truncateText(ticket.description)}
                        </strong>
                      </div>
                    </div>
                  </td>

                  <td className="text-start col-2 d-none d-lg-table-cell ticket-server border-0">
                    <span className="text-white fw-bold">
                      {truncateText(ticket.server, 50)}
                    </span>
                  </td>
                  <td className="text-start col-1 position-relative border-0">
                    <div className="d-flex justify-content-end pe-2">
                      <button
                        className="btn btn-primary btn-sm ticket-button me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreTicket(ticket.id);
                        }}
                      >
                        <i className="bi bi-arrow-counterclockwise"></i>
                      </button>
                    </div>
                    <small className="position-absolute ticket-id">
                      Ticket ID: {ticket.id}
                    </small>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        style={{ zIndex: "10000" }}
      />
    </div>
  );
}
