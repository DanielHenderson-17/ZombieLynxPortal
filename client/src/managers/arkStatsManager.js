const ARK_STATS_API_BASE_URL = "/api/ArkStats";

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

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/* ============================================================================
 * ✅ STATS ENDPOINTS
 * ========================================================================== */

/**
 * ✅ Get Ark stats for currently logged-in user
 * @returns {Promise<object|null>}
 */
export const getMyArkStats = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${ARK_STATS_API_BASE_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error fetching Ark stats for logged-in user:", err);
      return null;
    });
};

/**
 * ✅ Get Ark stats by userProfileId (admin/internal)
 * @param {number} userProfileId
 * @returns {Promise<object|null>}
 */
export const getArkStatsByUserProfileId = (userProfileId) => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${ARK_STATS_API_BASE_URL}/by-user/${userProfileId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error(
        `❌ Error fetching Ark stats for userProfileId ${userProfileId}:`,
        err
      );
      return null;
    });
};

/**
 * ✅ Get KD comparison summary for current user
 * @returns {Promise<object|null>}
 */
export const getKDStatSummary = () => {
  if (!isMainJwtValid()) return Promise.resolve(null);

  return fetch(`${ARK_STATS_API_BASE_URL}/kd-summary`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getMainJwtToken()}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch((err) => {
      console.error("❌ Error fetching KD stat summary:", err);
      return null;
    });
};
