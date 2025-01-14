import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, getTicketOptions } from "../../managers/ticketManager";
import { getAllUsers } from "../../managers/userProfileManager";

export default function NewTicket() {
  // State to manage ticket options and user data
  const [options, setOptions] = useState({
    games: [],
    servers: [],
    categories: [],
    users: [],
  });

  // State to manage form input values
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    game: "",
    server: "",
    description: "",
    assignedUserIds: [],
  });

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // React Router's navigation function
  const navigate = useNavigate();

  // Fetch ticket options and user data
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const ticketOptions = await getTicketOptions();
        const users = await getAllUsers();

        setOptions({
          games: ticketOptions.games,
          servers: ticketOptions.servers,
          categories: ticketOptions.categories,
          users: users.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          })),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket options or users:", error);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      setFormData({
        subject: "",
        category: "",
        game: "",
        server: "",
        description: "",
        assignedUserIds: [],
      });
      alert("Ticket created. Redirecting...");
      navigate("/tickets/open-tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="new-ticket-form col-md-6 col-10 mx-auto mt-5 pt-1 text-start">
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
            >
              <option value="">Select a server</option>
              {options.servers.map((server, index) => (
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
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  );
}
