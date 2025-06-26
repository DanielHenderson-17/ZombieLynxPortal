const BATTLEPASS_API_BASE_URL = "/api/BattlePass";

/* ============================================================================
 * ✅ TOKEN UTILITIES
 * ========================================================================== */

export const getMainJwtToken = () => localStorage.getItem("authToken");

export const isMainJwtValid = () => {
  const token = getMainJwtToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/* ============================================================================
 * ✅ BATTLE PASS ENDPOINTS
 * ========================================================================== */

/**
 * ✅ Get the active battle pass (public/shop view)
 * @returns {Promise<object|null>}
 */
export const getActiveBattlePass = () => {
  return fetch(`${BATTLEPASS_API_BASE_URL}`, {
    method: "GET",
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error fetching active battle pass:", err);
      return null;
    });
};

/**
 * ✅ Get battle pass status for the currently logged-in user
 * @returns {Promise<object|null>}
 */
export const getMyBattlePass = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${BATTLEPASS_API_BASE_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error fetching battle pass status:", err);
      return null;
    });
};

/**
 * ✅ Claim a specific level reward
 * @param {number} level
 * @returns {Promise<object|null>}
 */
export const claimBattlePassLevel = (level) => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${BATTLEPASS_API_BASE_URL}/claim/${level}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error(`❌ Error claiming level ${level} reward:`, err);
      return null;
    });
};

/**
 * ✅ Claim all available rewards
 * @returns {Promise<object|null>}
 */
export const claimAllBattlePassRewards = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${BATTLEPASS_API_BASE_URL}/claim-all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error claiming all available rewards:", err);
      return null;
    });
};

/**
 * ✅ Admin: Add XP to a user (by userProfileId)
 * @param {{ userProfileId: number, XP: number }} dto
 * @returns {Promise<object|null>}
 */
export const addBattlePassXp = (dto) => {
  return fetch(`${BATTLEPASS_API_BASE_URL}/add-xp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error adding XP to user:", err);
      return null;
    });
};

/**
 * ✅ Admin: Grant premium pass to a user (by userProfileId)
 * @param {{ userProfileId: number }} dto
 * @returns {Promise<object|null>}
 */
export const addPremiumToBattlePass = (dto) => {
  return fetch(`${BATTLEPASS_API_BASE_URL}/add-premium`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error granting premium to user:", err);
      return null;
    });
};
