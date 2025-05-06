const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const REDIRECT_URL = `${window.location.origin}/steam-callback.html`;
const API_BASE_URL = "https://localhost:5001/api/Steam";

/* ============================================================================
 * ✅ TOKEN UTILITIES
 * ========================================================================== */

/**
 * ✅ Retrieve JWT token from localStorage
 * @returns {string|null}
 */
export const getMainJwtToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * ✅ Check if JWT token is valid
 * @returns {boolean}
 */
export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

/* ============================================================================
 * ✅ LINKED ACCOUNT CHECK
 * ========================================================================== */

/**
 * ✅ Get linked Steam account
 * @returns {Promise<object|null>}
 */
export const getLinkedSteamAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${API_BASE_URL}/linked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
      if (res.status === 404) return null;
      throw new Error(`Unexpected error: ${res.status}`);
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
};

/* ============================================================================
 * ✅ STEAM API KEY
 * ========================================================================== */

/**
 * ✅ Fetch Steam API key
 * @returns {Promise<string|null>}
 */
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
    .then((data) => data.apiKey)
    .catch((err) => {
      console.error("❌ Error fetching Steam API key:", err);
      return null;
    });
};

/* ============================================================================
 * ✅ LINK STEAM ACCOUNT
 * ========================================================================== */

/**
 * ✅ Link Steam account via OpenID + Steam API
 * @param {Function} onSuccess - Callback on successful link
 */
export const linkSteamAccount = (onSuccess) => {
  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) return;

    const { type, steamId } = event.data;
    if (type === "STEAM_AUTH_SUCCESS" && steamId) {
      fetchSteamApiKey().then((apiKey) => {
        if (!apiKey) {
          console.error("❌ Cannot proceed without Steam API key.");
          window.removeEventListener("message", handleMessage);
          return;
        }

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
                  } else if (res.status === 409) {
                    if (window.opener && !window.opener.closed) {
                      window.opener.postMessage(
                        { type: "STEAM_DUPLICATE_ERROR" },
                        window.origin
                      );
                    }
                  } else {
                    console.error("❌ Failed to link Steam account.");
                  }
                })
                .catch((err) =>
                  console.error("❌ Error linking Steam account:", err)
                )
                .finally(() => {
                  window.removeEventListener("message", handleMessage);
                  if (steamWindow && !steamWindow.closed) {
                    steamWindow.close();
                  }
                });
            })
            .catch((err) => {
              console.error("❌ Error fetching Steam profile:", err);
              window.removeEventListener("message", handleMessage);
              if (steamWindow && !steamWindow.closed) {
                steamWindow.close();
              }
            });
        });
      });
    }
  };

  window.addEventListener("message", handleMessage); // ✅ must come before popup opens

  const steamLoginUrl =
    `${STEAM_OPENID_URL}?openid.ns=http://specs.openid.net/auth/2.0` +
    `&openid.mode=checkid_setup` +
    `&openid.return_to=${encodeURIComponent(REDIRECT_URL)}` +
    `&openid.realm=${window.location.origin}` +
    `&openid.identity=http://specs.openid.net/auth/2.0/identifier_select` +
    `&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

  var steamWindow = window.open(
    steamLoginUrl,
    "Steam Login",
    "width=600,height=800"
  );
};

/* ============================================================================
 * ✅ UNLINK STEAM ACCOUNT
 * ========================================================================== */

/**
 * ✅ Unlink Steam account
 * @param {Function} onSuccess - Callback on successful unlink
 * @returns {Promise<void>}
 */
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
