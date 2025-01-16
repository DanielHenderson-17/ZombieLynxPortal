const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const REDIRECT_URL = `${window.location.origin}/steam-callback.html`;
const API_BASE_URL = "https://localhost:5001/api/Steam";

export const getMainJwtToken = () => {
  return localStorage.getItem("authToken");
};

export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

export const getLinkedSteamAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${API_BASE_URL}/linked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

export const fetchSteamApiKey = () => {
  console.log("🔑 Fetching Steam API Key...");

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
      console.log("✅ Received Steam API Key:", data.apiKey);
      return data.apiKey;
    })
    .catch((err) => {
      console.error("❌ Error fetching Steam API key:", err);
      return null;
    });
};

export const linkSteamAccount = (onSuccess) => {
  fetchSteamApiKey().then((apiKey) => {
    if (!apiKey) {
      console.error("❌ Cannot proceed without Steam API key.");
      return;
    }

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

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, steamId } = event.data;
      if (type === "STEAM_AUTH_SUCCESS" && steamId) {
        console.log("✅ Steam ID received:", steamId);

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
                    console.log("✅ Steam account linked.");
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

export const unlinkSteamAccount = (onSuccess) => {
  return fetch(`${API_BASE_URL}/unlink-steam`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  }).then((res) => {
    if (res.ok) {
      console.log("Steam account unlinked.");
      if (onSuccess) onSuccess();
    } else {
      console.error("Failed to unlink Steam account.");
    }
  });
};
