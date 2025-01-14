import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  linkSteamAccount,
  unlinkSteamAccount,
  getLinkedSteamAccount,
  getMainJwtToken, // ✅ Import the main app token handler
} from "../../managers/steamAuthManager";
import "../../assets/styles/Member.css";

export default function Member({ loggedInUser }) {
  const [steamAccount, setSteamAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ❗ For error handling

  // ✅ Load Steam account if user is logged in
  useEffect(() => {
    if (loggedInUser && getMainJwtToken()) {
      // ✅ Ensure the main app JWT exists
      console.log("Fetching linked Steam account...");
      setLoading(true);
      getLinkedSteamAccount()
        .then((data) => {
          console.log("Fetched Steam account data:", data);
          setSteamAccount(data?.steamId ? data : null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading Steam account:", err);
          setError("Failed to load your Steam account.");
          setLoading(false);
        });
    } else {
      console.warn("No logged-in user or auth token found.");
      setSteamAccount(null);
      setLoading(false);
    }
  }, [loggedInUser]);

  // ✅ Handle linking Steam account
  const handleLinkSteam = () => {
    if (!getMainJwtToken()) {
      console.error("No valid main app token. Cannot link Steam.");
      setError("Please log in to link your Steam account.");
      return;
    }

    setError(null);
    linkSteamAccount(() => {
      getLinkedSteamAccount()
        .then((data) => setSteamAccount(data?.steamId ? data : null))
        .catch((err) => {
          console.error("Failed to fetch linked Steam account:", err);
          setError("Failed to link Steam account.");
        });
    });
  };

  // ✅ Handle unlinking Steam account
  const handleUnlinkSteam = () => {
    if (!getMainJwtToken()) {
      console.error("No valid main app token. Cannot unlink Steam.");
      setError("Please log in to unlink your Steam account.");
      return;
    }

    setError(null);
    unlinkSteamAccount(loggedInUser.id)
      .then(() => {
        setSteamAccount(null);
      })
      .catch((err) => {
        console.error("Failed to unlink Steam account:", err);
        setError("Failed to unlink Steam account.");
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
            ? "Processing..."
            : steamAccount
            ? "Unlink Steam Account"
            : "Link Steam Account"}
        </button>

        {loading ? (
          <p>Loading Steam account...</p>
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
      {error && <p className="text-danger">{error}</p>}{" "}
      <nav className="d-flex justify-content-start member-nav">
        <div className="col-6 d-flex justify-content-end">
          <NavLink
            to="stats"
            className={({ isActive }) =>
              `mx-4 text-white text-decoration-none ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Stats
          </NavLink>
          <NavLink
            to="shop"
            className={({ isActive }) =>
              `me-4 text-white text-decoration-none ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="tickets"
            className={({ isActive }) =>
              `text-white text-decoration-none me-4 ${
                isActive ? "border-bottom border-danger border-5" : ""
              }`
            }
          >
            Tickets
          </NavLink>
          <NavLink
            to="notifications"
            className={({ isActive }) =>
              `text-white text-decoration-none ${
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
