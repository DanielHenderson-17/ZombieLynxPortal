import { useState } from "react";
import { createNotification } from "../../managers/notificationManager";
import { useNavigate } from "react-router-dom";

export default function CreateNotification() {
  const [message, setMessage] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetUserIds, setTargetUserIds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    try {
      await createNotification({ message, isGlobal, targetUserIds });
      navigate("/notifications");
    } catch (err) {
      console.error("Error creating notification:", err);
      setError("Failed to create notification.");
    }
  };

  return (
    <div className="create-notification-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="col-12" onSubmit={handleSubmit}>
        <div className="form-group ">
          <label className="text-start col-8 p-2 mt-5">
            Message:
            <textarea
              className="col-8"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ width: "100%", margin: "10px 0" }}
              required
            ></textarea>
          </label>
        </div>
        <div className="text-start col-8 mx-auto ps-2">
          <label>
            <input
              className="text-start me-2"
              type="radio"
              value="true"
              checked={isGlobal}
              onChange={() => setIsGlobal(true)}
            />
            All Users
          </label>
          <br />
          <label>
            <input
              className="me-2 text-start"
              type="radio"
              value="false"
              checked={!isGlobal}
              onChange={() => setIsGlobal(false)}
            />
            Targeted Notification (Specific Users)
          </label>
        </div>
        {!isGlobal && (
          <div>
            <label>
              Target User IDs (Comma-separated):
              <input
                type="text"
                className="col-12 my-2 mx-0"
                value={targetUserIds.join(",")}
                onChange={(e) =>
                  setTargetUserIds(
                    e.target.value.split(",").map((id) => parseInt(id.trim()))
                  )
                }
              />
            </label>
          </div>
        )}
        <div className="d-flex justify-content-end col-8 mx-auto">
          <button type="submit" className="btn btn-success mb-3 me-3">
            <i className="bi bi-plus"></i> Create Notification
          </button>
        </div>
      </form>
    </div>
  );
}
