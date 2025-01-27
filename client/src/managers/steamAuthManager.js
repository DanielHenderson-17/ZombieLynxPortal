const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const REDIRECT_URL = `${window.location.origin}/steam-callback.html`;
const API_BASE_URL = "https://localhost:5001/api/Steam";

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

// Get linked Steam account
export const getLinkedSteamAccount = () => {
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

// Fetch Steam API key
export const fetchSteamApiKey = () => {
  return fetch(`${API_BASE_URL}/get-api-key`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to retrieve Steam API key.");
      return res.json();
    })
    .then((data) => {
      return data.apiKey;
    })
    .catch((err) => {
      console.error("❌ Error fetching Steam API key:", err);
      return null;
    });
};

// Link Steam account
export const linkSteamAccount = (onSuccess) => {
  fetchSteamApiKey().then((apiKey) => {
    if (!apiKey) {
      console.error("❌ Cannot proceed without Steam API key.");
      return;
    }

    // Open Steam login popup window and redirect to Steam OpenID login page for authentication
    const steamLoginUrl =
      `${STEAM_OPENID_URL}?openid.ns=http://specs.openid.net/auth/2.0` +
      `&openid.mode=checkid_setup` +
      `&openid.return_to=${encodeURIComponent(REDIRECT_URL)}` +
      `&openid.realm=${window.location.origin}` +
      `&openid.identity=http://specs.openid.net/auth/2.0/identifier_select` +
      `&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

    const steamWindow = window.open(
      steamLoginUrl,
      "Steam Login",
      "width=600,height=800"
    );

    // Handle Steam auth response from popup window (steam-callback.html) and link account to user profile on server side if successful leveraging CORS proxy
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      // Extract Steam ID from auth response and fetch Steam profile data using Steam API key and CORS proxy server (corsproxy.io) to link account to user profile
      const { type, steamId } = event.data;
      if (type === "STEAM_AUTH_SUCCESS" && steamId) {
        const proxyUrl = "https://corsproxy.io/?";
        const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        delay(1000).then(() => {
          fetch(proxyUrl + encodeURIComponent(steamApiUrl), {
            method: "GET",
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.response || !data.response.players.length) {
                throw new Error("❌ No player data received.");
              }

              const player = data.response.players[0];
              const steamData = {
                SteamId: steamId,
                SteamName: player.personaname,
                SteamImgUrl: player.avatarfull,
              };

              fetch(`${API_BASE_URL}/link-steam`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getMainJwtToken()}`,
                },
                body: JSON.stringify(steamData),
              })
                .then((res) => {
                  if (res.ok) {
                    if (onSuccess) onSuccess();

                    if (steamWindow && !steamWindow.closed) {
                      steamWindow.close();
                    }
                    window.removeEventListener("message", handleMessage);
                  } else {
                    console.error("❌ Failed to link Steam account.");
                  }
                })
                .catch((err) =>
                  console.error("❌ Error linking Steam account:", err)
                );
            })
            .catch((err) =>
              console.error("❌ Error fetching Steam profile:", err)
            );
        });
      }
    };

    window.addEventListener("message", handleMessage);
  });
};

// Unlink Steam account
export const unlinkSteamAccount = (onSuccess) => {
  return fetch(`${API_BASE_URL}/unlink-steam`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  }).then((res) => {
    if (res.ok) {
      if (onSuccess) onSuccess();
    } else {
      console.error("Failed to unlink Steam account.");
    }
  });
};
