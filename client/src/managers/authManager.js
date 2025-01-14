const apiUrl = "https://localhost:7254/api/Auth";

// Save the token to session storage
const saveToken = (token) => {
  sessionStorage.setItem("authToken", token);
};

// Get the token from session storage
export const getToken = () => {
  return sessionStorage.getItem("authToken");
};

// Login user
export const login = (email, password) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error("Invalid login");
    })
    .then((data) => {
      saveToken(data.token);
      return data;
    });
};

// Register user
export const register = (user) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => {
    if (res.ok) return res.json();
    throw new Error("Registration failed");
  });
};

// Get logged-in user
export const tryGetLoggedInUser = () => {
  const token = getToken();
  if (!token) return Promise.resolve(null);

  return fetch(`${apiUrl}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Logout user
export const logout = () => {
  sessionStorage.removeItem("authToken");
  return Promise.resolve();
};
