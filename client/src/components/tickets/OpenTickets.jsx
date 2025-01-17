import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    // Start fetching tickets
    fetchTickets();

    // Set a timeout to show the loading message if fetching takes longer than 1 second
    const timeout = setTimeout(() => {
      if (fetching) {
        setLoading(true);
      }
    }, 1000);

    // Cleanup timeout if fetching finishes before the timeout
    return () => clearTimeout(timeout);
  }, [fetching]);

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/ticket/${ticketId}`);
  };

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
        <p className="mt-5 pt-4 text-white">You have no open tickets.</p>
      ) : (
        <table className="table table-dark table-striped align-middle">
          <thead className="thead-dark">
            <tr>
              <th className="text-center col-1 d-none d-lg-table-cell">Game</th>
              <th className="text-start col-md-4 col-8">Topic</th>

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
                  <td className="text-start col-1 d-none d-lg-table-cell">
                    <span className="text-warning fw-bold mx-auto">
                      <img
                        className="gameImg ms-1"
                        src={getGameImage(ticket.game)}
                        alt=""
                      />
                    </span>
                  </td>
                  <td className="text-start col-4">
                    <div>
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

                  <td className="text-start col-2 d-none d-lg-table-cell">
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
