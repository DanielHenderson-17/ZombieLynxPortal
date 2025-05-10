import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getOpenTickets, closeTicketAPI } from "../../managers/ticketManager";
import { getGameImage } from "../../utils/gameFormatter";
import { truncateText } from "../../utils/truncateText";

export default function OpenTickets({ onTicketChange }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  // Handle closing a ticket
  const handleCloseTicket = async (ticketId) => {
    try {
      await closeTicketAPI(ticketId);
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
      onTicketChange();
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

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
      {tickets.length === 0 ? (
        <div className="mt-md-5 mt-0">
          <div className="d-md-flex d-none no-tickets justify-content-center align-items-center h-100">
            <div>
              <p className="mt-5 pt-4 text-white fs-4">
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
            <img src="/images/Kaeneko.png" alt="" className="kaeneko" />
          </div>
          <div className="d-block d-md-none no-tickets justify-content-center align-items-center h-100">
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
            <tr>
              <th className="text-center col-1 d-none d-lg-table-cell">Game</th>
              <th className="text-start col-md-4 col-8 ticket-topic-title">
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
              .slice()
              .reverse()
              .map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-start col-1 d-none d-lg-table-cell p-0 single-ticket">
                    <span className="text-warning fw-bold mx-auto">
                      <img
                        className="gameImg3 ms-1"
                        src={getGameImage(ticket.game)}
                        alt=""
                      />
                    </span>
                  </td>
                  <td className="text-start col-4">
                    <div className="ticket-topic">
                      <strong className="text-white">
                        {truncateText(ticket.subject, 35)}
                      </strong>
                      <div className="d-flex">
                        <strong className="sub-text col-12">
                          {ticket.category}
                        </strong>
                      </div>
                      <div className="d-md-none d-flex">
                        <img
                          className="gameImg2 me-2 my-auto"
                          src={getGameImage(ticket.game)}
                          alt=""
                        />
                        <small>{ticket.server}</small>
                      </div>
                      <small className="sub-text">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </small>
                      <br />
                      <small className="sub-text">
                        {ticket.assignedUsers
                          .map((user) => `${user.firstName}`)
                          .join(", ")}
                      </small>
                    </div>
                  </td>

                  <td className="text-start col-2 d-none d-lg-table-cell ticket-server">
                    <span className="text-white fw-bold">
                      {truncateText(ticket.server, 50)}
                    </span>
                  </td>
                  <td className="text-start col-1 position-relative">
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
    </div>
  );
}
