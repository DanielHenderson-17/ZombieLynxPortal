const API_BASE_URL = "https://localhost:5001/api/Epic";
const DISCORD_API_BASE_URL = "https://localhost:5001/api/Discord";
const EPIC_AUTH_URL = `${window.location.origin}/epic-auth.html`;

/* ============================================================================
 * ✅ TOKEN UTILITIES
 * ========================================================================== */

/**
 * ✅ Retrieve JWT token from localStorage
 * @returns {string|null}
 */
export const getMainJwtToken = () => localStorage.getItem("authToken");

/**
 * ✅ Check if the JWT token is valid
 * @returns {boolean}
 */
export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

/* ============================================================================
 * ✅ LINKED ACCOUNT CHECKS
 * ========================================================================== */

/**
 * ✅ Check if Discord is linked (required for Epic linking)
 * @returns {Promise<object|null>}
 */
export const getLinkedDiscordAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${DISCORD_API_BASE_URL}/linked`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error checking Discord link:", err);
      return null;
    });
};

/**
 * ✅ Check if Epic account is linked
 * @returns {Promise<object|null>}
 */
export const getLinkedEpicAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${API_BASE_URL}/linked`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error checking Epic link:", err);
      return null;
    });
};

/* ============================================================================
 * ✅ LINKING & UNLINKING
 * ========================================================================== */

/**
 * ✅ Open popup to link Epic account
 */
export const openEpicAuthWindow = () => {
  const epicWindow = window.open(
    EPIC_AUTH_URL,
    "Epic Link",
    "width=600,height=800"
  );

  if (!epicWindow) {
    alert("Please allow popups for this site.");
    return;
  }

  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) return;

    const { type, eosId, epicName } = event.data;
    if (type === "EPIC_AUTH_SUCCESS" && eosId) {
      const epicData = {
        EosId: eosId,
        EpicName: epicName,
      };

      fetch(`${API_BASE_URL}/link-epic`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getMainJwtToken()}`,
        },
        body: JSON.stringify(epicData),
      })
        .then((res) => {
          if (res.ok) {
            if (epicWindow && !epicWindow.closed) {
              epicWindow.close();
            }
            window.removeEventListener("message", handleMessage);
          } else {
            console.error("❌ Failed to link Epic account.");
          }
        })
        .catch((err) => console.error("❌ Error linking Epic account:", err));
    }
  };

  window.addEventListener("message", handleMessage);
};

/**
 * ✅ Unlink Epic account
 * @param {Function} onSuccess - Callback on success
 * @returns {Promise<void>}
 */
export const unlinkEpicAccount = (onSuccess) => {
  return fetch(`${API_BASE_URL}/unlink-epic`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  }).then((res) => {
    if (res.ok) {
      if (onSuccess) onSuccess();
    } else {
      console.error("❌ Failed to unlink Epic account.");
    }
  });
};

// Allow access to auth window globally
window.openEpicAuthWindow = openEpicAuthWindow;
