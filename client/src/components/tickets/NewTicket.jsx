import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, getTicketOptions } from "../../managers/ticketManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllUsers } from "../../managers/userProfileManager";

export default function NewTicket({ loggedInUser }) {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState({
    games: [],
    gamesWithServers: {},
    categories: [],
    users: [],
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

  const navigate = useNavigate();

  // User validation on component mount to ensure user is logged in and has the correct role to create a ticket
  useEffect(() => {
    if (!loggedInUser) {
      alert("You must be logged in to create a ticket.");
      navigate("/login");
      return;
    }

    // Optionally, validate role if needed
    if (loggedInUser.role !== "User" && loggedInUser.role !== "Admin") {
      alert("You do not have permission to create a ticket.");
      navigate("/");
      return;
    }
  }, [loggedInUser, navigate]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Fetch ticket options and user data on component mount to populate the form select fields with the available options and users in the system
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const ticketOptions = await getTicketOptions();
        const users = await getAllUsers();

        setOptions({
          games: Object.keys(ticketOptions.gamesWithServers),
          gamesWithServers: ticketOptions.gamesWithServers,
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

  // Update available servers when the game changes in the form data state object and reset the server field to an empty string if the game changes to a new game without servers or if the game is cleared out in the form data state object (e.g., when the game select field is reset to its default value)
  useEffect(() => {
    if (formData.game) {
      setAvailableServers(options.gamesWithServers[formData.game] || []);
      setFormData((prev) => ({ ...prev, server: "" }));
    }
  }, [formData.game, options.gamesWithServers]);

  // Handle input changes in the form fields and update the form data state object accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdTicket = await createTicket({
        ...formData,
        createdBy: loggedInUser.id,
      });

      const ticketId = createdTicket?.id;
      if (!ticketId) throw new Error("Ticket ID not returned.");

      setFormData({
        subject: "",
        category: "",
        game: "",
        server: "",
        description: "",
        assignedUserIds: [],
      });

      toast.success("Ticket created! Redirecting...", { autoClose: 3000 });

      setTimeout(() => {
        navigate(`/member/tickets/ticket/${ticketId}`);
      }, 3000);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket.");
    }
  };

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-5 pt-0 px-3`}
    >
      <h3
        className="text-white facebook-header text-start px-0 py-2 m-0"
        style={{ minHeight: "3rem" }}
      >
        Create Ticket
      </h3>
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
        <div className="text-md-end text-start">
          <button
            type="submit"
            className="btn btn-success create-ticket-submit"
          >
            Create Ticket
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        style={{ zIndex: "10000" }}
      />
    </div>
  );
}
