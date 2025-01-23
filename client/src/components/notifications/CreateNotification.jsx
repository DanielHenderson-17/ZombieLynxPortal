import { useEffect, useState } from "react";
import {
  createNotification,
  getAllUsersAndId,
} from "../../managers/notificationManager";
import { useNavigate } from "react-router-dom";

export default function CreateNotification() {
  const [message, setMessage] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetUserIds, setTargetUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsersAndId();
        setAllUsers(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerCaseQuery) ||
        user.lastName.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleCheckboxChange = (profileId) => {
    setTargetUserIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (!isGlobal && targetUserIds.length === 0) {
      setError(
        "You must select at least one user for a targeted notification."
      );
      return;
    }
    try {
      await createNotification({
        message,
        isGlobal,
        targetUserIds,
      });
      window.alert("Notification created successfully!");
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
        <div className="form-group">
          <label className="text-start col-md-8 col-11 pt-2 mt-4">
            Message:
            <textarea
              className="col-md-8 col-11 p-2"
              placeholder="Enter your notification here and then select the users you want to send it to."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ width: "100%", margin: "10px 0" }}
              required
            ></textarea>
          </label>
        </div>
        <div className="text-start col-md-8 col-11 mx-auto ps-2 d-flex justify-content-between">
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
          <label>
            <input
              className="me-2 text-start"
              type="radio"
              value="false"
              checked={!isGlobal}
              onChange={() => setIsGlobal(false)}
            />
            Specific Users
          </label>
        </div>
        {!isGlobal && (
          <div className="mt-2 text-start col-md-8 col-11 mx-auto ">
            <input
              type="text"
              className="form-control my-2"
              placeholder="Type to search users by name or email"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="user-selection mb-2">
              {filteredUsers.map((user) => (
                <div key={user.profileId} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`user-${user.profileId}`}
                    value={user.profileId}
                    checked={targetUserIds.includes(user.profileId)}
                    onChange={() => handleCheckboxChange(user.profileId)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`user-${user.profileId}`}
                  >
                    {user.firstName} {user.lastName} ({user.email})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="d-flex justify-content-end col-md-8 col-11 mx-auto">
          <button type="submit" className="btn btn-success mb-3 me-0 mt-3">
            <i className="bi bi-plus"></i> Create Notification
          </button>
        </div>
      </form>
    </div>
  );
}
