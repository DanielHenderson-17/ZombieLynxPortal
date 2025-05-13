import { useEffect, useState } from "react";
import { getAllUserData, promoteUser } from "../../managers/userProfileManager";
import { formatDiscordName } from "../../utils/formatDiscordName";
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

  useEffect(() => {
    getAllUserData()
      .then((data) => {
        console.log("Fetched user data:", data);
        setUsers(data);
      })
      .catch(() => toast.error("Failed to load admin user data."));
  }, []);

  const formatTierIcon = (timedString) => {
    let tier = "Standard"; // Default fallback

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
        title={tier}
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

  return (
    <div className="notifications-container pt-5 px-3">
      {users.map((u) => (
        <div
          key={u.id}
          className="border-bottom border-secondary p-3 mb-3 d-flex align-items-center justify-content-between flex-wrap admin-user-card"
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={u.zlgMember?.discordImgUrl}
              alt="discord avatar"
              className="rounded-circle"
              style={{ width: 48, height: 48 }}
            />
            <div>
              <div className="fw-bold d-flex align-items-center text-white mb-1">
                <div className="me-1">
                  {formatTierIcon(u.zlgMember?.timedPermissionGroups)}
                </div>
                <div>{formatDiscordName(u.zlgMember?.discordName)}</div>
              </div>
              <div className="small text-white text-start align-items-center d-flex">
                Linked Accounts:
                {u.zlgMember?.steamId && (
                  <img
                    src="/steamIcon.png"
                    alt="Steam"
                    title={`${u.zlgMember.steamName} (${u.zlgMember.steamId})`}
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
                    title={`${u.zlgMember.minecraftUsername} (${u.zlgMember.minecraftUuid})`}
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
                    title={`${u.zlgMember.epicName} (${u.zlgMember.eosId})`}
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
            </div>
          </div>

          <div className="text-end ms-auto">
            <div className="fw-bold text-white d-flex align-items-center justify-content-end">
              Points: {u.zlgMember?.points ?? 0}
              <button className="btn btn-sm btn-success ms-2" disabled>
                +
              </button>
            </div>

            {u.role !== "Admin" && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={() => setConfirmId(u.id)}
              >
                Promote to Admin
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
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
                  Are you sure you want to promote this user to Admin? They will
                  gain full access.
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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
}
