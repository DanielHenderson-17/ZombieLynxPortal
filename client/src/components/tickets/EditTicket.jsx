import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  editTicket,
  getTicketOptions,
} from "../../managers/ticketManager";

export default function EditTicket({ loggedInUser }) {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    games: [],
    gamesWithServers: {},
    categories: [],
  });

  const [availableServers, setAvailableServers] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    game: "",
    server: "",
    description: "",
    assignedUserIds: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticket = await getTicketById(ticketId);

        // Validate user authorization
        const isAssigned = ticket.assignedUsers.some(
          (user) => user.id === loggedInUser.id
        );

        if (!isAssigned) {
          alert("You are not authorized to edit this ticket.");
          navigate("/tickets/open-tickets");
          return;
        }

        // Fetch ticket options
        const ticketOptions = await getTicketOptions();

        setOptions({
          games: Object.keys(ticketOptions.gamesWithServers),
          gamesWithServers: ticketOptions.gamesWithServers,
          categories: ticketOptions.categories,
        });

        setFormData({
          subject: ticket.subject,
          category: ticket.category,
          game: ticket.game,
          server: ticket.server,
          description: ticket.description,
          assignedUserIds: ticket.assignedUsers.map((user) => user.id),
        });

        setAvailableServers(ticketOptions.gamesWithServers[ticket.game] || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
        navigate("/tickets/open-tickets"); // Redirect in case of an error
      }
    };

    fetchData();
  }, [ticketId, loggedInUser, navigate]);

  // Update available servers when the game changes
  useEffect(() => {
    if (formData.game) {
      setAvailableServers(options.gamesWithServers[formData.game] || []);
      setFormData((prev) => ({ ...prev, server: "" }));
    }
  }, [formData.game, options.gamesWithServers]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTicket(ticketId, formData);
      alert("Ticket updated successfully!");
      navigate("/tickets/open-tickets");
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="edit-ticket-form col-md-6 col-10 mx-auto mt-5 pt-1 text-start">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label text-white">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3 d-flex gap-3">
          <div className="flex-fill">
            <label htmlFor="category" className="form-label text-white">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              {options.categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-fill">
            <label htmlFor="game" className="form-label text-white">
              Game
            </label>
            <select
              id="game"
              name="game"
              value={formData.game}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a game</option>
              {options.games.map((game, index) => (
                <option key={index} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-fill">
            <label htmlFor="server" className="form-label text-white">
              Server
            </label>
            <select
              id="server"
              name="server"
              value={formData.server}
              onChange={handleChange}
              className="form-select"
              required
              disabled={!formData.game}
            >
              <option value="">Select a server</option>
              {availableServers.map((server, index) => (
                <option key={index} value={server}>
                  {server}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control description-min-height"
            required
          />
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
