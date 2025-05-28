import { useEffect, useState } from "react";
import { createNotification } from "../../managers/notificationManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { useNavigate } from "react-router-dom";
import { getAllUserData } from "../../managers/userProfileManager";

export default function CreateNotification() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetUserIds, setTargetUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showGlobalConfirm, setShowGlobalConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUserData();
        const usersWithZLG = users.filter((u) => u.zlgMember?.userProfileId);
        setAllUsers(usersWithZLG);
        setFilteredUsers(usersWithZLG);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lower = query.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.zlgMember?.discordName?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower) ||
        user.profile?.firstName?.toLowerCase().includes(lower) ||
        user.profile?.lastName?.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  const sendNotification = async () => {
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
      toast.error("Message cannot be empty.");
      return;
    }

    if (isGlobal) {
      setShowGlobalConfirm(true);
      return;
    }

    if (targetUserIds.length === 0) {
      toast.error(
        "You must select at least one user for a targeted notification."
      );
      return;
    }

    await sendNotification();
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
        Create Notification
      </h3>
      <form
        onSubmit={handleSubmit}
        className="p-md-4 p-1 rounded col-md-6 col-12 mx-auto"
      >
        {/* Subject */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-black">
            <i className="bi bi-card-text"></i>
          </span>
          <textarea
            className="form-control bg-dark text-white border border-black"
            placeholder="Notification Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows="1"
            required
          />
        </div>

        {/* Message */}
        <div className="mb-3 input-group">
          <span className="input-group-text bg-dark text-white border border-black align-items-start">
            <i className="bi bi-chat-dots-fill"></i>
          </span>
          <textarea
            className="form-control bg-dark text-white border border-black"
            placeholder="Enter your notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            required
          />
        </div>

        {/* Target Audience: Global or Specific */}
        <div className="mb-3 d-flex justify-content-between bg-dark text-white px-3 py-2 rounded border border-black">
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
              <span className="input-group-text bg-dark text-white border border-black">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border border-black"
                placeholder="Search users by name or email"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div
              className="bg-dark text-white p-2 rounded border border-black"
              style={{ maxHeight: "180px", overflowY: "auto" }}
            >
              {filteredUsers.length === 0 ? (
                <div>No users loaded</div>
              ) : (
                filteredUsers
                  .filter((user) => user.zlgMember && user.profile)
                  .map((user) => (
                    <div
                      key={user.zlgMember.userProfileId}
                      className="form-check my-1"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`user-${user.zlgMember.userProfileId}`}
                        value={user.zlgMember.userProfileId}
                        checked={targetUserIds.includes(
                          user.zlgMember.userProfileId
                        )}
                        onChange={() =>
                          handleCheckboxChange(user.zlgMember.userProfileId)
                        }
                      />
                      <label
                        className="form-check-label text-start d-block ms-2"
                        htmlFor={`user-${user.zlgMember.userProfileId}`}
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            src={user.zlgMember.discordImgUrl}
                            alt="avatar"
                            className="rounded-circle"
                            style={{
                              width: "24px",
                              height: "24px",
                              objectFit: "cover",
                            }}
                          />
                          {formatDiscordName(user.zlgMember.discordName)}
                        </span>
                      </label>
                    </div>
                  ))
              )}
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

      {showGlobalConfirm && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1055,
            overflowY: "auto",
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{
              margin: "1.75rem auto",
              width: "100%",
              maxWidth: "500px",
              padding: "0 1rem",
            }}
          >
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header">
                <h5 className="modal-title">Send Notification to All Users</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowGlobalConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  This will send a notification to{" "}
                  <strong>{allUsers.length}</strong> users! Are you sure you
                  want to proceed?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGlobalConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setShowGlobalConfirm(false);
                    sendNotification();
                  }}
                >
                  Yes, Send It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
