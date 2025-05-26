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
  const [subjectTooLong, setSubjectTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      alert("You must be logged in to create a ticket.");
      navigate("/login");
      return;
    }
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

  useEffect(() => {
    if (formData.game) {
      setAvailableServers(options.gamesWithServers[formData.game] || []);
      setFormData((prev) => ({ ...prev, server: "" }));
    }
  }, [formData.game, options.gamesWithServers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject") setSubjectTooLong(value.length > 20);
    if (name === "description") setDescriptionTooLong(value.length > 90);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.subject.length > 20) {
      toast.error("Subject cannot be longer than 20 characters.");
      return;
    }
    if (formData.description.length > 90) {
      toast.error("Description cannot be longer than 90 characters.");
      return;
    }

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

      toast.success("Ticket created! Redirecting...");
      setTimeout(() => navigate(`/member/tickets/ticket/${ticketId}`), 3000);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket.");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-5 pt-0 px-3`}
    >
      <h3
        className="text-white facebook-header text-start text-md-center px-0 py-2 m-0"
        style={{ minHeight: "3rem" }}
      >
        Create Ticket
      </h3>

      <form
        onSubmit={handleSubmit}
        className="p-md-4 p-1 rounded col-md-6 col-12 mx-auto"
      >
        {/* Subject */}
        <div className="mb-4 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border border-black">
              <i className="bi bi-ticket-fill"></i>
            </span>
            <input
              type="text"
              name="subject"
              className="form-control bg-dark text-white border border-black pe-5"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Ticket subject"
              required
              style={{ paddingRight: "3.5rem" }}
            />
            <span className="d-none" />
          </div>
          <small
            className={`position-absolute bottom-0 end-0 me-2 mb-1 ${
              subjectTooLong ? "text-danger" : "text-secondary"
            }`}
            style={{
              fontSize: "0.75rem",
              pointerEvents: "none",
              zIndex: 100,
              backgroundColor: "#212529",
              padding: "0 4px",
            }}
          >
            {formData.subject.length}/20
          </small>
        </div>

        {/* Game, Category, Server */}
        <div className="mb-3 d-flex flex-column gap-3">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border border-black">
              <i className="fa-solid fa-gamepad"></i>
            </span>
            <select
              name="game"
              className="form-select bg-dark text-white border border-black"
              value={formData.game}
              onChange={handleChange}
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

          <div className="input-group">
            <span className="input-group-text bg-dark text-white border border-black">
              <i className="bi bi-tags-fill"></i>
            </span>
            <select
              name="category"
              className="form-select bg-dark text-white border border-black"
              value={formData.category}
              onChange={handleChange}
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

          <div className="input-group">
            <span className="input-group-text bg-dark text-white border border-black">
              <i className="bi bi-hdd-network-fill"></i>
            </span>
            <select
              name="server"
              className="form-select bg-dark text-white border border-black"
              value={formData.server}
              onChange={handleChange}
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

        {/* Description */}
        <div className="mb-4 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border border-black align-items-start">
              <i className="bi bi-chat-dots-fill"></i>
            </span>
            <textarea
              name="description"
              className="form-control bg-dark text-white border border-black pe-5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={5}
              style={{ paddingRight: "3.5rem" }}
              required
            />
            <span className="d-none" />
          </div>
          <small
            className={`position-absolute bottom-0 end-0 me-2 mb-1 ${
              descriptionTooLong ? "text-danger" : "text-secondary"
            }`}
            style={{
              fontSize: "0.75rem",
              pointerEvents: "none",
              zIndex: 100,
              backgroundColor: "#212529",
              padding: "0 4px",
            }}
          >
            {formData.description.length}/90
          </small>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-success d-flex align-items-center gap-2"
          >
            <i className="bi bi-send-fill"></i>Create Ticket
          </button>
        </div>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
