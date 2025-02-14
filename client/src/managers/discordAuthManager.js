const DISCORD_AUTH_URL = "https://discord.com/oauth2/authorize";
const REDIRECT_URL = `${window.location.origin}/discord-callback.html`;
const API_BASE_URL = "https://localhost:5001/api/Discord";

// Set JWT token in Local Storage
export const getMainJwtToken = () => {
  return localStorage.getItem("authToken");
};

// Check if JWT token is valid
export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

export const getLinkedDiscordAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${API_BASE_URL}/linked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 404) {
        return null;
      } else {
        throw new Error(`Unexpected error: ${res.status}`);
      }
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const fetchDiscordClientId = () => {
  return fetch(`${API_BASE_URL}/get-api-key`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to retrieve Discord Client ID.");
      return res.json();
    })
    .then((data) => {
      return data.clientId; // Updated to return clientId, not apiKey
    })
    .catch((err) => {
      console.error("❌ Error fetching Discord Client ID:", err);
      return null;
    });
};

export const linkDiscordAccount = (onSuccess) => {
  fetchDiscordClientId().then((clientId) => {
    if (!clientId) {
      console.error("❌ Cannot proceed without Discord Client ID.");
      return;
    }

    // Open Discord login popup window and redirect to Discord OAuth page for authentication
    const discordLoginUrl =
      `${DISCORD_AUTH_URL}?client_id=${clientId}` + // Updated to use Client ID
      `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
      `&response_type=token` +
      `&scope=identify`;

    const discordWindow = window.open(
      discordLoginUrl,
      "Discord Login",
      "width=600,height=800"
    );

    // Handle Discord auth response from popup window
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      // Extract Discord user details from the auth response
      const { type, discordId, discordName, discordImgUrl } = event.data;
      if (type === "DISCORD_AUTH_SUCCESS" && discordId) {
        const discordData = {
          DiscordId: discordId,
          DiscordName: discordName,
          DiscordImgUrl: discordImgUrl,
        };

        fetch(`${API_BASE_URL}/link-discord`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getMainJwtToken()}`,
          },
          body: JSON.stringify(discordData),
        })
          .then((res) => {
            if (res.ok) {
              if (onSuccess) onSuccess();

              if (discordWindow && !discordWindow.closed) {
                discordWindow.close();
              }
              window.removeEventListener("message", handleMessage);
            } else {
              console.error("❌ Failed to link Discord account.");
            }
          })
          .catch((err) =>
            console.error("❌ Error linking Discord account:", err)
          );
      }
    };

    window.addEventListener("message", handleMessage);
  });
};

export const unlinkDiscordAccount = (onSuccess) => {
  return fetch(`${API_BASE_URL}/unlink-discord`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  }).then((res) => {
    if (res.ok) {
      if (onSuccess) onSuccess();
    } else {
      console.error("Failed to unlink Discord account.");
    }
  });
};
