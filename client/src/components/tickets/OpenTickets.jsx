import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getOpenTickets, closeTicketAPI } from "../../managers/ticketManager";
import { getGameImage } from "../../utils/gameFormatter";
import { truncateText } from "../../utils/truncateText";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { categoryFormatter } from "../../utils/categoryFormatter";

export default function OpenTickets({ onTicketChange }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const data = await getOpenTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching open tickets:", error);
      setError("Failed to fetch open tickets. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  // Fetch open tickets on component mount
  useEffect(() => {
    fetchTickets();

    const timeout = setTimeout(() => {
      if (fetching) {
        setLoading(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [fetching]);
  // Handle ticket click and navigate to ticket details
  const handleTicketClick = (ticketId) => {
    navigate(`/member/tickets/ticket/${ticketId}`);
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await closeTicketAPI(ticketId);
      toast.success("Ticket closed.", { autoClose: 3000 });

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
      onTicketChange();
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close the ticket.");
    }
  };

  const filteredTickets = tickets
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
          `${user.zlgMember?.discordName || ""} ${user.firstName || ""} ${
            user.lastName || ""
          }`
            .toLowerCase()
            .includes(term)
        )
      );
    })
    .slice()
    .reverse();

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (loading) {
    return <p className="mt-5 pt-4 text-white">Loading tickets...</p>;
  }

  if (fetching) {
    return null;
  }

  return (
    <div className="col-12 h-100 ticket-body1 border border-0">
      <div className="px-3 pt-3">
        <h3 className="text-white facebook-header text-start m-0">
          Open Tickets
        </h3>
        <div className="rainbow-spin-wrapper mt-md-3 my-2 w-100">
          <input
            type="text"
            className="rainbow-spin-input"
            placeholder="Search for a ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search rainbow-search-icon"></i>
        </div>
      </div>
      {tickets.length === 0 ? (
        <div className="mt-md-5 mt-0">
          <div className="d-md-flex d-none no-tickets justify-content-center align-items-center h-100">
            <div>
              <p className="mt-5 pt-4 text-white fs-4">
                You have no open tickets.
              </p>
            </div>
            <img src="/images/Kaeneko.png" alt="" className="kaeneko" />
          </div>
          <div className="d-block d-md-none no-tickets justify-content-center align-items-center">
            <img src="/images/Kaeneko.png" alt="" className="kaeneko" />
            <div>
              <p className="mt-2 pt-2 text-white fs-4">
                You have no open tickets.
              </p>
              <Link
                to="/member/tickets/new-ticket"
                className={`d-flex justify-content-center text-decoration-none ${
                  location.pathname === "/member/tickets/new-ticket"
                    ? "active"
                    : ""
                }`}
              >
                <button className="btn d-block d-flex align-items-center text-center mb-3 btn-success create-ticket">
                  <i className="bi bi-plus-circle me-2"></i>
                  <p className="m-0 p-0">Create a Ticket</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
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
            {filteredTickets.map((ticket) => (
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
                              {formatDiscordName(user.zlgMember?.discordName) ||
                                `${user.firstName} ${user.lastName}`}
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
                      className="btn btn-danger btn-sm ticket-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTicket(ticket.id);
                      }}
                    >
                      <i className="bi bi-x-circle"></i>
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
