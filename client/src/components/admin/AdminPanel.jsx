import { useEffect, useState } from "react";
import {
  getAllUserData,
  promoteUser,
  updateUserPoints,
} from "../../managers/userProfileManager";
import EditPointsModal from "./EditPointsModal";
import ConfirmPointsModal from "./ConfirmPointsModal";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import { toast, ToastContainer } from "react-toastify";
import "./AdminPanel.css";

const tierIcons = {
  Gold: "/images/gold.png",
  Diamond: "/images/diamond.png",
  Vibranium: "/images/vibranium.png",
  Standard: "/images/standard.png",
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedPoints, setEditedPoints] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getAllUserData()
      .then((data) => {
        setUsers(data);
      })
      .catch(() => toast.error("Failed to load admin user data."));
  }, [refreshFlag]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const formatTierIcon = (timedString) => {
    let tier = "Standard";

    if (timedString && typeof timedString === "string") {
      const [parsedTier] = timedString.split(":");
      if (tierIcons[parsedTier]) {
        tier = parsedTier;
      }
    }

    const src = tierIcons[tier];
    return (
      <img
        src={src}
        alt={tier}
        title={timedString || "No subscription"}
        style={{ width: 20, height: 20 }}
      />
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copied!");
  };

  const handlePromote = (id) => {
    promoteUser(id)
      .then(() => {
        toast.success("User promoted to Admin.");
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: "Admin" } : u))
        );
      })
      .catch(() => toast.error("Failed to promote user."))
      .finally(() => setConfirmId(null));
  };

  const handleEditPoints = (user) => {
    setDropdownOpenId(null);
    setSelectedUser({
      userProfileId: user.zlgMember.userProfileId,
      discordName: user.zlgMember?.discordName,
      discordImgUrl: user.zlgMember?.discordImgUrl,
      points: user.zlgMember?.points ?? 0,
    });
    setEditedPoints(user.zlgMember?.points ?? 0);
    setShowEditModal(true);
  };

  const handleConfirmPointsUpdate = () => {
    if (!selectedUser) return;

    updateUserPoints(
      selectedUser.userProfileId,
      selectedUser.points,
      editedPoints
    )
      .then((result) => {
        if (!result) return null;
        toast.success("Points updated!");
        setShowConfirmModal(false);
        setRefreshFlag((prev) => !prev);
      })
      .catch((err) => {
        console.error("❌ updateUserPoints failed:", err);
        toast.error("Failed to update points.");
      });
  };

  const filteredUsers = users
    .filter((u) => {
      const s = searchTerm.toLowerCase();
      const z = u.zlgMember;
      return (
        z?.discordName?.toLowerCase().includes(s) ||
        z?.steamName?.toLowerCase().includes(s) ||
        z?.minecraftUsername?.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (a.role === "Admin" && b.role !== "Admin") return 1;
      if (a.role !== "Admin" && b.role === "Admin") return -1;
      return 0;
    });

  return (
    <div
      className={`admin-container fade-container pt-5 ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      {/* Fixed search bar */}
      <div className=" pb-0 bg-dark">
        <div className="d-flex align-items-center gap-2 admin-search-bar">
          <input
            type="text"
            className="form-control m-3"
            placeholder="Search Discord, Steam, or Minecraft name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Scrollable users list */}
      <div className="admin-scroll-area px-3 py-3">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="border-bottom border-secondary p-2 mb-3 d-flex align-items-center justify-content-between flex-wrap admin-user-card"
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <img
                  src={u.zlgMember?.discordImgUrl}
                  alt="discord avatar"
                  className="rounded-circle"
                  style={{ width: 54, height: 54 }}
                />
                {u.role !== "Admin" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    className="position-absolute bounce-hover"
                    title="Promote to Admin"
                    onClick={() => setConfirmId(u.id)}
                    style={{
                      top: -6,
                      right: -6,
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  >
                    <title>Promote to Admin</title>
                    {/* Red circle background */}
                    <circle cx="8" cy="8" r="8" fill="#dc3545" />

                    {/* White upward arrow */}
                    <path fill="white" d="M8 4l-3 3h2v4h2V7h2l-3-3z" />
                  </svg>
                )}
              </div>

              <div>
                <div className="fw-bold d-flex justify-content-start align-items-center text-white">
                  <div className="me-1">
                    {formatTierIcon(u.zlgMember?.timedPermissionGroups)}
                  </div>
                  <div className="d-flex align-items-center gap-2 align-items-center">
                    <span>{formatDiscordName(u.zlgMember?.discordName)}</span>
                  </div>
                </div>

                <div className="small text-white text-start align-items-center d-flex">
                  <i className="bi bi-link-45deg fs-6 pt-1 pe-2"></i>Linked
                  Accounts:
                  {u.zlgMember?.steamId && (
                    <img
                      src="/steamIcon.png"
                      alt="Steam"
                      title={`Copy 📋\n${u.zlgMember.steamName} (${u.zlgMember.steamId})`}
                      onClick={() => handleCopy(u.zlgMember.steamId)}
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 6,
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {u.zlgMember?.minecraftUuid && (
                    <img
                      src="/minecraftIcon.png"
                      alt="Minecraft"
                      title={`Copy 📋\n${u.zlgMember.minecraftUsername} (${u.zlgMember.minecraftUuid})`}
                      onClick={() => handleCopy(u.zlgMember.minecraftUuid)}
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 6,
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {u.zlgMember?.eosId && (
                    <img
                      src="/epicIcon.png"
                      alt="Epic Games"
                      title={`Copy 📋\n${u.zlgMember.epicName} (${u.zlgMember.eosId})`}
                      onClick={() => handleCopy(u.zlgMember.eosId)}
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 6,
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                <div className="text-white text-start d-flex justify-content-start align-items-center">
                  <img
                    src="/images/zlgCoin.png"
                    alt=""
                    style={{ width: "20px" }}
                    className="me-1"
                  />
                  <strong className="pb-1">
                    {formatNumberWithCommas(u.zlgMember?.points ?? 0)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="text-end ms-auto">
              <div className="position-relative">
                <button
                  onClick={() =>
                    setDropdownOpenId(dropdownOpenId === u.id ? null : u.id)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "4px",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-three-dots-vertical text-white fs-5" />
                </button>

                {dropdownOpenId === u.id && (
                  <div
                    className="position-absolute bg-dark border rounded"
                    style={{
                      top: "110%",
                      right: 0,
                      zIndex: 10,
                      minWidth: "120px",
                    }}
                  >
                    <button onClick={() => handleEditPoints(u)}>
                      Edit Points
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {confirmId && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Promotion</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() => setConfirmId(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to promote this user to Admin? They
                    will gain full access.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handlePromote(confirmId)}
                  >
                    Yes, Promote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && selectedUser && (
          <EditPointsModal
            user={{
              ...selectedUser,
              discordImgUrl:
                users.find(
                  (u) =>
                    u.zlgMember?.userProfileId === selectedUser.userProfileId
                )?.zlgMember?.discordImgUrl || "",
            }}
            editedPoints={editedPoints}
            setEditedPoints={setEditedPoints}
            onClose={() => setShowEditModal(false)}
            onSave={() => {
              setShowEditModal(false);
              setShowConfirmModal(true);
            }}
          />
        )}

        {showConfirmModal && selectedUser && (
          <ConfirmPointsModal
            user={selectedUser}
            editedPoints={editedPoints}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmPointsUpdate}
          />
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
        />
      </div>
    </div>
  );
}
