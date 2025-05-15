const _apiUrl = "/api/userprofile";

/* ============================================================================
 * ✅ AUTH UTILITIES
 * ========================================================================== */

/**
 * ✅ Retrieve JWT token from localStorage
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * ✅ Get authorization headers for fetch requests
 * @returns {object}
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

/* ============================================================================
 * 🔍 PROFILE & ROLE MANAGEMENT
 * ========================================================================== */

/**
 * 🔍 Get the current user's profile
 * @returns {Promise<object>}
 */
export const getUserProfiles = () => {
  return fetch(_apiUrl, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profile")
  );
};

/**
 * 🔍 Get all users (admin only)
 * @returns {Promise<object[]>}
 */
export const getAllUsers = () => {
  return fetch(`${_apiUrl}/all`, {
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching users: ${res.statusText}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching all users:", error);
      throw error;
    });
};

/**
 * 🔍 Get all user profiles including roles (admin only)
 * @returns {Promise<object[]>}
 */
export const getUserProfilesWithRoles = () => {
  return fetch(`${_apiUrl}/withroles`, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profiles with roles")
  );
};

/**
 * 🛡️ Fetch all users + ZLGMember data (Admin only)
 * @returns {Promise<Array>}
 */
export const getAllUserData = () => {
  const token = getToken();

  return fetch(`/api/auth/all-user-data`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok)
        throw new Error("Unauthorized or failed to fetch user data.");
      return res.json();
    })
    .catch((error) => {
      console.error("Admin user data fetch error:", error);
      throw error;
    });
};

/**
 * 🔼 Promote a user to Admin
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const promoteUser = (userId) => {
  return fetch(`${_apiUrl}/promote/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to promote user");
  });
};

/**
 * 🔽 Demote a user from Admin
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const demoteUser = (userId) => {
  return fetch(`${_apiUrl}/demote/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to demote user");
  });
};

/* ============================================================================
 * 🔍 MEMBERSHIP & SETTINGS
 * ========================================================================== */

/**
 * 🔍 Get user membership info (points & subscriptions)
 * @returns {Promise<object>}
 */
export const getUserMembership = () => {
  return fetch(`${_apiUrl}/membership`, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch membership info")
  );
};

/**
 * ✅ Update marketing email preference
 * @param {boolean} allowMarketingEmails
 * @returns {Promise<string>}
 */
export const updateMarketingConsent = (allowMarketingEmails) => {
  return fetch(`${_apiUrl}/marketing-consent`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ allowMarketingEmails }),
  }).then((res) =>
    res.ok ? res.text() : Promise.reject("Failed to update marketing consent")
  );
};

export const updateUserPoints = (userProfileId, oldPoints, newPoints) => {
  return fetch(`${_apiUrl}/edit-points`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      UserProfileId: userProfileId,
      OldPoints: oldPoints,
      Points: newPoints,
    }),
  }).then((res) =>
    res.ok ? res.text() : Promise.reject("Failed to update user points")
  );
};
