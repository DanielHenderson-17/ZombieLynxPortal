const API_BASE_URL = "https://localhost:5001/api/Minecraft";
const DISCORD_API_BASE_URL = "https://localhost:5001/api/Discord";
const MINECRAFT_AUTH_URL = `${window.location.origin}/minecraft-auth.html`;

// ✅ Get JWT Token from Local Storage
export const getMainJwtToken = () => localStorage.getItem("authToken");

// ✅ Check if JWT Token is Valid
export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};

// ✅ Check if Discord is Linked
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

// ✅ Check if Minecraft is Linked
export const getLinkedMinecraftAccount = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);
  return fetch(`${API_BASE_URL}/linked`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error checking Minecraft link:", err);
      return null;
    });
};

export const linkMinecraftAccount = (onSuccess) => {
  fetch(`${API_BASE_URL}/link-minecraft`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMainJwtToken()}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        if (onSuccess) onSuccess();
        console.log("✅ Minecraft account linked successfully.");
      } else {
        console.error("❌ Failed to link Minecraft account.");
      }
    })
    .catch((err) => console.error("❌ Error linking Minecraft account:", err));
};

// ✅ Open Minecraft Authentication Popup (600x800)
export const openMinecraftAuthWindow = () => {
  const minecraftWindow = window.open(
    MINECRAFT_AUTH_URL,
    "Minecraft Link",
    "width=600,height=800"
  );

  if (!minecraftWindow) {
    alert("Please allow popups for this site.");
    return;
  }

  // Listen for messages from the popup
  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) return;

    // Extract Minecraft user details from the auth response
    const { type, minecraftUuid, minecraftUsername, minecraftAvatarUrl } =
      event.data;
    if (type === "MINECRAFT_AUTH_SUCCESS" && minecraftUuid) {
      const minecraftData = {
        MinecraftUuid: minecraftUuid,
        MinecraftUsername: minecraftUsername,
        MinecraftAvatarUrl: minecraftAvatarUrl,
      };

      fetch(`${API_BASE_URL}/link-minecraft`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getMainJwtToken()}`,
        },
        body: JSON.stringify(minecraftData),
      })
        .then((res) => {
          if (res.ok) {
            if (minecraftWindow && !minecraftWindow.closed) {
              minecraftWindow.close();
            }
            window.removeEventListener("message", handleMessage);
          } else {
            console.error("❌ Failed to link Minecraft account.");
          }
        })
        .catch((err) =>
          console.error("❌ Error linking Minecraft account:", err)
        );
    }
  };

  window.addEventListener("message", handleMessage);
};

// ✅ Unlink Minecraft Account
export const unlinkMinecraftAccount = (onSuccess) => {
  return fetch(`${API_BASE_URL}/unlink-minecraft`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  }).then((res) => {
    if (res.ok) {
      if (onSuccess) onSuccess();
    } else {
      console.error("❌ Failed to unlink Minecraft account.");
    }
  });
};
