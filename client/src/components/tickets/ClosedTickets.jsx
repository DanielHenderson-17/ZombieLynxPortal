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

export default function ClosedTickets({ onTicketChange }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
      {tickets.length === 0 ? (
        <p className="mt-5 text-white">You have no tickets yet!</p>
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
                  <td className="text-start col-1 d-none d-lg-table-cell single-ticket">
                    <span className="text-warning fw-bold mx-auto">
                      <img
                        className="gameImg ms-1"
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
