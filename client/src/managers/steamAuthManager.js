const _authUrl = "/api/SteamAuth";

// ✅ Use the correct main app JWT token (authToken)
export const getMainJwtToken = () => {
  const token = localStorage.getItem("authToken");
  console.log("Retrieved Main App JWT Token:", token);
  return token;
};

export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const isExpired = payload.exp * 1000 < Date.now();

  console.log("Main JWT Valid:", !isExpired);
  return !isExpired;
};

// ✅ Get linked Steam account using main app JWT
export const getLinkedSteamAccount = () => {
  if (!isMainJwtValid()) {
    console.warn("Main JWT is invalid or expired.");
    return Promise.resolve(null);
  }

  return fetch(`${_authUrl}/linked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMainJwtToken()}`, // ✅ Using main JWT
    },
  })
    .then((res) => {
      console.log("Steam Linked Response:", res);
      return res.ok ? res.json() : null;
    })
    .catch((err) => {
      console.error("Error fetching Steam account:", err);
      return null;
    });
};

// ✅ Link Steam account with Authorization header
export const linkSteamAccount = (onWindowClose) => {
  const steamWindow = window.open(
    "/api/SteamAuth/login", // ✅ Removed auth token in URL
    "Steam Login",
    "width=600,height=800"
  );

  const handleMessage = (event) => {
    console.log("Received message from Steam window:", event.data);
    if (event.data?.type === "steamLinked") {
      console.log("Steam account linked successfully.");
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

// ✅ Unlink Steam account with main app JWT
export const unlinkSteamAccount = (identityUserId) => {
  if (!isMainJwtValid()) {
    console.error("Cannot unlink Steam account. JWT is invalid.");
    return Promise.reject("Invalid or expired JWT.");
  }

  return fetch(`${_authUrl}/unlink`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMainJwtToken()}`, // ✅ Using main JWT
    },
    body: JSON.stringify({ identityUserId }),
  }).then((res) => {
    console.log("Unlink Response:", res);
    if (!res.ok) throw new Error("Failed to unlink Steam account.");
    return res.text();
  });
};
