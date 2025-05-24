import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVote, getGames } from "../../managers/voteManager";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Vote.css";

export default function CreateVote() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    gameId: "",
    title: "",
    description: "",
    expiresAt: "",
  });

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch((err) => {
        toast.error("Failed to load games.");
        console.error("Game load error:", err);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createVote({
        gameId: parseInt(form.gameId),
        title: form.title,
        description: form.description,
        expiresAt: form.expiresAt || null,
      });

      toast.success("Vote created.");
      navigate("/member/vote");
    } catch (err) {
      toast.error("Failed to create vote.");
      console.error("Vote create error:", err);
    }
  };

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
        Create Vote
      </h3>
      <form
        onSubmit={handleSubmit}
        className="p-md-4 p-1 rounded col-md-6 col-12 mx-auto"
      >
        {/* Game Selection */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-black">
            <i className="fa-solid fa-gamepad"></i>
          </span>
          <select
            className="form-select bg-dark text-white border border-black"
            name="gameId"
            value={form.gameId}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Select a game
            </option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name} ({game.platform})
              </option>
            ))}
          </select>
        </div>
        {/* Vote Title */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-black">
            <i className="bi bi-check-square-fill"></i>
          </span>
          <input
            type="text"
            name="title"
            className="form-control bg-dark text-white border border-black"
            value={form.title}
            onChange={handleChange}
            placeholder="Vote title"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-black align-items-start">
            <i className="bi bi-chat-dots-fill"></i>
          </span>
          <textarea
            name="description"
            className="form-control bg-dark text-white border border-black"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={5}
          />
        </div>
        {/* Expiration Date */}
        <div className="mb-3 input-group d-flex align-items-center">
          <span className="input-group-text bg-dark text-white border border-black">
            <i className="bi bi-calendar2-date-fill"></i>
          </span>
          <DatePicker
            selected={form.expiresAt}
            onChange={(date) => setForm({ ...form, expiresAt: date })}
            showTimeSelect
            timeFormat="h:mm aa"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control rounded-end-2 rounded-start-0 bg-dark text-white border border-black"
            minDate={new Date()}
            placeholderText="Choose expiration date"
            popperPlacement="top-start"
          />
          <span className="ms-2 text-secondary">: Optional</span>
        </div>
        {/* Submit Button */}
        <div className="d-flex justify-content-start">
          <button
            type="submit"
            className="btn btn-success d-flex align-items-center gap-2"
          >
            <i className="bi bi-send-fill"></i>Submit
          </button>
        </div>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
