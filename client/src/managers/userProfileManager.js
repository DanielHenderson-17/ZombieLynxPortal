const _apiUrl = "/api/userprofile";

// ✅ Use localStorage for persistent authentication
const getToken = () => {
  return localStorage.getItem("authToken");
};

// ✅ Centralized function to attach Authorization headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// 🔍 Get the current logged-in user's profile
export const getUserProfiles = () => {
  return fetch(_apiUrl, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profile")
  );
};

// Get all users
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

// 🔍 Get user profiles with roles (Admin only)
export const getUserProfilesWithRoles = () => {
  return fetch(`${_apiUrl}/withroles`, {
    headers: getAuthHeaders(),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profiles with roles")
  );
};

// 🔼 Promote user to Admin
export const promoteUser = (userId) => {
  return fetch(`${_apiUrl}/promote/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to promote user");
  });
};

// 🔽 Demote user to User
export const demoteUser = (userId) => {
  return fetch(`${_apiUrl}/demote/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to demote user");
  });
};
