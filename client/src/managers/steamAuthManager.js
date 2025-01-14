const _authUrl = "/api/SteamAuth";

export const setSteamJwtToken = (token) => {
  localStorage.setItem("steam_jwt_token", token);
};

export const getSteamJwtToken = () => {
  return localStorage.getItem("steam_jwt_token");
};

export const removeSteamJwtToken = () => {
  localStorage.removeItem("steam_jwt_token");
};

export const isSteamJwtValid = () => {
  const token = getSteamJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const isExpired = payload.exp * 1000 < Date.now();

  return !isExpired;
};

export const getLinkedSteamAccount = () => {
  if (!isSteamJwtValid()) {
    removeSteamJwtToken();
    return Promise.resolve(null);
  }

  return fetch(`${_authUrl}/linked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSteamJwtToken()}`,
    },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
};

export const linkSteamAccount = (onWindowClose) => {
  const steamWindow = window.open(
    "/api/SteamAuth/login",
    "Steam Login",
    "width=600,height=800"
  );

  const handleMessage = (event) => {
    if (event.data?.type === "steamLinked" && event.data?.token) {
      setSteamJwtToken(event.data.token);
      getLinkedSteamAccount().finally(() => {
        window.removeEventListener("message", handleMessage);
      });
    }
  };

  window.addEventListener("message", handleMessage);

  const checkWindowClosed = setInterval(() => {
    if (steamWindow.closed) {
      clearInterval(checkWindowClosed);
      window.removeEventListener("message", handleMessage);
      onWindowClose && onWindowClose();
    }
  }, 500);
};

export const unlinkSteamAccount = (identityUserId) => {
  return fetch(`${_authUrl}/unlink`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getSteamJwtToken()}`,
    },
    body: JSON.stringify({ identityUserId }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to unlink Steam account.");
    removeSteamJwtToken();
    return res.text();
  });
};
