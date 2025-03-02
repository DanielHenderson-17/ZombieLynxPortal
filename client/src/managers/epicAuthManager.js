const API_BASE_URL = "https://localhost:5001/api/Epic";
const DISCORD_API_BASE_URL = "https://localhost:5001/api/Discord";
const EPIC_AUTH_URL = `${window.location.origin}/epic-auth.html`;

// ✅ Get JWT Token from Local Storage
export const getMainJwtToken = () => localStorage.getItem("authToken");

// ✅ Check if JWT Token is Valid
export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

// ✅ Check if Discord is Linked (required for Epic)
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

// ✅ Check if Epic is Linked
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

// ✅ Link Epic Account via Popup
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

  // Listen for messages from the popup
  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) return;

    // Extract Epic user details from the auth response
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

// ✅ Unlink Epic Account
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

window.openEpicAuthWindow = openEpicAuthWindow;
