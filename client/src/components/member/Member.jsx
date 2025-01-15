import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  linkSteamAccount,
  unlinkSteamAccount,
  getLinkedSteamAccount,
  getMainJwtToken,
} from "../../managers/steamAuthManager";
import "../../assets/styles/Member.css";

export default function Member({ loggedInUser }) {
  const [steamAccount, setSteamAccount] = useState(null);
  const [loading, setLoading] = useState(false); // ⬅ Changed from `true` to `false`
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // ✅ Fetch linked Steam account on load or refresh
  useEffect(() => {
    fetchLinkedAccount();
  }, [refreshTrigger]);

  const fetchLinkedAccount = () => {
    if (loggedInUser && getMainJwtToken()) {
      console.log("🔎 Fetching linked Steam account from backend...");
      setLoading(true);
      getLinkedSteamAccount()
        .then((data) => {
          console.log("📦 Fetched Steam account data:", data);
          setSteamAccount(data?.steamId ? data : null);
        })
        .catch((err) => {
          console.error("❌ Error fetching Steam account:", err);
          setError("Failed to load your Steam account.");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleLinkSteam = () => {
    if (!getMainJwtToken()) {
      console.error("❌ No valid JWT token.");
      setError("Please log in to link your Steam account.");
      return;
    }

    console.log("🔗 Starting Steam linking process...");
    setError(null);
    setLoading(true);

    linkSteamAccount(() => {
      console.log("✅ Steam account linked. Triggering UI refresh...");
      setRefreshTrigger((prev) => !prev);
      setLoading(false);
    });
  };

  const handleUnlinkSteam = () => {
    if (!getMainJwtToken()) {
      console.error("❌ No valid JWT token.");
      setError("Please log in to unlink your Steam account.");
      return;
    }

    console.log("🗑️ Unlinking Steam account...");
    setError(null);
    setLoading(true);

    unlinkSteamAccount(() => {
      console.log("✅ Steam account unlinked. Refreshing UI...");
      setSteamAccount(null);
      setRefreshTrigger((prev) => !prev);
      setLoading(false);
    });
  };

  return (
    <div className="member-layout border mt-5 w-100 px-0">
      <div className="member-header">
        <h1>Welcome, {loggedInUser?.username || "Member"}!</h1>
        <p>Manage your account and navigate through the system below.</p>
      </div>

      <div className="d-flex align-items-center mb-3">
        <button
          className={`btn me-3 ${steamAccount ? "btn-danger" : "btn-primary"}`}
          onClick={steamAccount ? handleUnlinkSteam : handleLinkSteam}
          disabled={loading}
        >
          {loading
            ? steamAccount
              ? "Unlinking Steam Account..."
              : "Linking Steam Account..."
            : steamAccount
            ? "Unlink Steam Account"
            : "Link Steam Account"}
        </button>

        {loading ? (
          <p>Processing...</p>
        ) : steamAccount ? (
          <div className="d-flex align-items-center">
            <img
              src={steamAccount.steamImgUrl}
              alt="Steam Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <span className="text-white">{steamAccount.steamName}</span>
          </div>
        ) : (
          <p className="text-white">No Steam account linked.</p>
        )}
      </div>

      {error && <p className="text-danger">{error}</p>}

      <nav className="d-flex justify-content-start member-nav">
        <div className="col-6 d-flex justify-content-end">
          <NavLink
            to="stats"
            className={({ isActive }) =>
              `mx-4 text-white ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Stats
          </NavLink>
          <NavLink
            to="shop"
            className={({ isActive }) =>
              `me-4 text-white ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="tickets"
            className={({ isActive }) =>
              `text-white me-4 ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Tickets
          </NavLink>
          <NavLink
            to="notifications"
            className={({ isActive }) =>
              `text-white ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Notifications
          </NavLink>
        </div>
      </nav>

      <div className="member-content">
        <Outlet />
      </div>
    </div>
  );
}
