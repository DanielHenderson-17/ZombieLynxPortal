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

const tierIcons = {
  Gold: "/images/gold.png",
  Diamond: "/images/diamond.png",
  Vibranium: "/images/vibranium.png",
  Standard: "/images/standard.png",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedPoints, setEditedPoints] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    getAllUserData()
      .then(setUsers)
      .catch(() => toast.error("Failed to load user data."));
  }, [refreshFlag]);

  const formatTierIcon = (timedString) => {
    let tier = "Standard";
    if (timedString && typeof timedString === "string") {
      const [parsedTier] = timedString.split(":");
      if (tierIcons[parsedTier]) tier = parsedTier;
    }
    return (
      <img
        src={tierIcons[tier]}
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
      .then(() => {
        toast.success("Points updated!");
        setShowConfirmModal(false);
        setRefreshFlag((prev) => !prev);
      })
      .catch(() => toast.error("Failed to update points."));
  };

  const filteredUsers = users
    .filter((u) => {
      const s = searchTerm.toLowerCase();
      const z = u.zlgMember || {};

      return (
        (z.discordName || "").toLowerCase().includes(s) ||
        (z.steamName || "").toLowerCase().includes(s) ||
        (z.minecraftUsername || "").toLowerCase().includes(s) ||
        (z.epicName || "").toLowerCase().includes(s) ||
        (u.email || "").toLowerCase().includes(s) ||
        (u.firstName || "").toLowerCase().includes(s) ||
        (u.lastName || "").toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (a.role === "Admin" && b.role !== "Admin") return 1;
      if (a.role !== "Admin" && b.role === "Admin") return -1;
      return 0;
    });

  return (
    <div className="notifications-container fade-container fade-in pt-md-1">
      {/* Search Bar */}
      <div className="pb-0 bg-dark">
        <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 admin-search-bar col-12 px-md-3 ps-0">
          <div className="rainbow-spin-wrapper mt-2">
            <input
              type="text"
              className="rainbow-spin-input"
              placeholder="Search Discord, Steam, or Minecraft name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search rainbow-search-icon"></i>
          </div>
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

      {/* User list */}
      <div className="admin-scroll-area px-3 pb-3 pt-0">
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
                    <circle cx="8" cy="8" r="8" fill="#dc3545" />
                    <path fill="white" d="M8 4l-3 3h2v4h2V7h2l-3-3z" />
                  </svg>
                )}
              </div>

              <div>
                <div className="fw-bold d-flex text-white align-items-center">
                  <div className="me-1">
                    {formatTierIcon(u.zlgMember?.timedPermissionGroups)}
                  </div>
                  <span>{formatDiscordName(u.zlgMember?.discordName)}</span>
                </div>

                <div className="small text-white d-flex align-items-center">
                  <i className="bi bi-link-45deg fs-6 pt-1 pe-2"></i>
                  Linked Accounts:
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

                <div className="text-white d-flex align-items-center mt-1">
                  <img
                    src="/images/zlgCoin.png"
                    alt=""
                    style={{ width: 20 }}
                    className="me-1"
                  />
                  <strong>
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
                  className="btn btn-sm btn-link text-white p-0"
                >
                  <i className="bi bi-three-dots-vertical fs-5" />
                </button>

                {dropdownOpenId === u.id && (
                  <div
                    className="position-absolute bg-dark border rounded"
                    style={{ top: "110%", right: 0, zIndex: 10 }}
                  >
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => handleEditPoints(u)}
                    >
                      EditPoints
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <ConfirmPointsModal
          user={users.find((u) => u.id === confirmId)}
          onClose={() => setConfirmId(null)}
          onConfirm={() => handlePromote(confirmId)}
        />
      )}

      {showEditModal && selectedUser && (
        <EditPointsModal
          user={{
            ...selectedUser,
            discordImgUrl:
              users.find(
                (u) => u.zlgMember?.userProfileId === selectedUser.userProfileId
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
  );
}
