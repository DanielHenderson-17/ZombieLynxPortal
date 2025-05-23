import { useEffect, useState } from "react";
import {
  createNotification,
  getAllUsersAndId,
} from "../../managers/notificationManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function CreateNotification() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetUserIds, setTargetUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch all users on component mount and set the allUsers and filteredUsers state variables to the fetched users
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on the search query and set the filteredUsers state variable to the filtered users array and the searchQuery state variable to the search query
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

  // Add or remove a user ID from the targetUserIds state variable based on whether the user is already selected or not
  const handleCheckboxChange = (profileId) => {
    setTargetUserIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  // Handle form submission by checking if the message is empty or if no users are selected for a targeted notification, then create a notification with the message, isGlobal, and targetUserIds state variables
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    if (!isGlobal && targetUserIds.length === 0) {
      toast.error(
        "You must select at least one user for a targeted notification."
      );
      return;
    }

    try {
      await createNotification({
        message,
        isGlobal,
        targetUserIds,
        subject,
      });
      toast.success("Notification created successfully!");

      setTimeout(() => {
        navigate("/member/notifications", { replace: true });
      }, 4000);
    } catch (err) {
      toast.error("Failed to create notification.");
      console.error("Error creating notification:", err);
    }
  };

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-5 px-3`}
    >
      <form
        onSubmit={handleSubmit}
        className="p-md-4 p-1 rounded col-md-6 col-12 mx-auto"
      >
        <h2 className="text-white mb-4">Create Notification</h2>

        {/* Subject */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-secondary">
            <i className="bi bi-card-text"></i>
          </span>
          <textarea
            className="form-control bg-dark text-white border border-secondary"
            placeholder="Notification Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows="1"
            required
          />
        </div>

        {/* Message */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-secondary align-items-start">
            <i className="bi bi-chat-dots-fill"></i>
          </span>
          <textarea
            className="form-control bg-dark text-white border border-secondary"
            placeholder="Enter your notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
          />
        </div>

        {/* Target Audience: Global or Specific */}
        <div className="mb-3 d-flex justify-content-between bg-dark text-white px-3 py-2 rounded border border-secondary">
          <div className="form-check">
            <input
              className="form-check-input me-2"
              type="radio"
              name="audience"
              value="true"
              checked={isGlobal}
              onChange={() => setIsGlobal(true)}
              id="globalRadio"
            />
            <label className="form-check-label" htmlFor="globalRadio">
              All Users
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input me-2"
              type="radio"
              name="audience"
              value="false"
              checked={!isGlobal}
              onChange={() => setIsGlobal(false)}
              id="specificRadio"
            />
            <label className="form-check-label" htmlFor="specificRadio">
              Specific Users
            </label>
          </div>
        </div>

        {/* User Search and Selection */}
        {!isGlobal && (
          <div className="mb-3">
            <div className="mb-2 input-group">
              <span className="input-group-text bg-dark text-white border border-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border border-secondary"
                placeholder="Search users by name or email"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="bg-dark text-white p-2 rounded border border-secondary">
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
                    className="form-check-label text-start"
                    htmlFor={`user-${user.profileId}`}
                  >
                    {user.firstName} {user.lastName} ({user.email})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-success d-flex align-items-center gap-2"
          >
            <i className="bi bi-send-fill"></i>
            <span>Create Notification</span>
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
