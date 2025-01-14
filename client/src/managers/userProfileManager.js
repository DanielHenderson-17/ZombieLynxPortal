const _apiUrl = "https://localhost:7254/api/userprofile";

// 📥 Get the token from session storage
const getToken = () => {
  return sessionStorage.getItem("authToken");
};

// 🔍 Get the current logged-in user's profile
export const getUserProfiles = () => {
  return fetch(_apiUrl, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profile")
  );
};

// 🔍 Get all users (Admin only)
export const getAllUsers = () => {
  return fetch(`${_apiUrl}/all`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
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
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to fetch profiles with roles")
  );
};

// 🔼 Promote user to Admin
export const promoteUser = (userId) => {
  return fetch(`${_apiUrl}/promote/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to promote user");
  });
};

// 🔽 Demote user to User
export const demoteUser = (userId) => {
  return fetch(`${_apiUrl}/demote/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to demote user");
  });
};
