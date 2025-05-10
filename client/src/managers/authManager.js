const apiUrl = "/api/Auth";

/* ============================================================================
 * ✅ TOKEN MANAGEMENT
 * ========================================================================== */

/**
 * ✅ Save the token to local storage
 * @param {string} token - JWT token to be saved
 */
const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

/**
 * ✅ Get the token from local storage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * ✅ Decode JWT to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null
 */
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
};

/**
 * ✅ Check if the JWT is expired
 * @param {string} token
 * @returns {boolean}
 */
export const isJwtExpired = (token) => {
  try {
    const decoded = parseJwt(token);
    if (!decoded?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err) {
    console.error("Error checking token expiration:", err);
    return true;
  }
};

/* ============================================================================
 * ✅ AUTHENTICATION
 * ========================================================================== */

/**
 * ✅ Login user and save the token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} - User data or error
 */
export const login = (email, password) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .then((data) => {
      if (!data?.token) return null;

      saveToken(data.token);
      return fetch(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      }).then((res) => (res.ok ? res.json() : null));
    })
    .catch((error) => {
      console.error("Login failed:", error);
      return null;
    });
};

/**
 * ✅ Register a new user
 * @param {object} user - User registration data
 * @returns {Promise<object>} - Response data or error
 */
export const register = (user) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        return data;
      }
      console.error("Server Response:", data);
      throw new Error(data.message || "Registration failed.");
    })
    .catch((error) => {
      console.error("Registration error:", error);
      throw error;
    });
};

/**
 * ✅ Check if a user is logged in by verifying the JWT
 * @returns {Promise<object|null>} - Logged-in user data or null
 */
export const tryGetLoggedInUser = () => {
  const token = getToken();
  if (!token) return Promise.reject("No auth token found.");

  return fetch(`${apiUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => (res.ok ? res.json() : Promise.reject("Invalid token")));
};

/**
 * ✅ Logout the user and remove the token
 * @returns {Promise<void>}
 */
export const logout = () => {
  localStorage.removeItem("authToken");
  return Promise.resolve();
};

/* ============================================================================
 * 🔥 EMAIL & ACCOUNT MANAGEMENT
 * ========================================================================== */

/**
 * 🔥 Resend email verification link
 * @param {string} email - User's email
 * @returns {Promise<string>} - Success message
 */
export const resendVerificationEmail = (email) => {
  return fetch(`${apiUrl}/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((res) => {
      if (res.ok) return res.text();
      throw new Error("Failed to resend verification email.");
    })
    .catch((error) => {
      console.error("Resend verification error:", error);
      throw error;
    });
};

/**
 * ✅ Update user account details
 * @param {object} updateData
 * @returns {Promise<string>} - Success message
 */
export const updateAccount = (updateData) => {
  const token = getToken();
  return fetch(`${apiUrl}/update-account`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((msg) => {
        throw new Error(msg || "Failed to update account.");
      });
    }
    return res.text();
  });
};

/**
 * ✅ Deactivate the user's account (soft delete)
 * @returns {Promise<string>} - Success message or error
 */
export const deactivateAccount = () => {
  const token = getToken();
  return fetch(`${apiUrl}/deactivate-account`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((msg) => {
        throw new Error(msg || "Failed to deactivate account.");
      });
    }
    return res.text();
  });
};

/* ============================================================================
 * 🔐 PASSWORD RESET
 * ========================================================================== */

/**
 * 🔐 Request a password reset email
 * @param {string} email - User's email
 * @returns {Promise<string>} - Success or failure message
 */
export const requestPasswordReset = (email) => {
  return fetch(`${apiUrl}/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to send reset email.");
      return res.json();
    })
    .then((data) => data.message)
    .catch((error) => {
      console.error("Password reset request error:", error);
      throw error;
    });
};

/**
 * 🔐 Submit a new password using reset token
 * @param {string} token - Reset token
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @returns {Promise<string>} - Success message
 */
export const resetPassword = (token, newPassword, confirmPassword) => {
  return fetch(`${apiUrl}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      newPassword,
      confirmPassword,
    }),
  })
    .then((res) => {
      if (!res.ok)
        return res.json().then((data) => {
          throw new Error(data.error || "Password reset failed.");
        });
      return res.json();
    })
    .then((data) => data.message)
    .catch((error) => {
      console.error("Reset password error:", error);
      throw error;
    });
};
