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
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
      return null;
    }
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
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
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
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        return { error: errorText }; // <-- forward the error
      }

      const data = await res.json();
      if (!data?.token) return { error: "Invalid response from server." };

      saveToken(data.token);

      const userInfo = await fetch(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      }).then((res) =>
        res.ok ? res.json() : { error: "Failed to fetch user info." }
      );

      return {
        ...userInfo,
        hasAcceptedTerms: data.hasAcceptedTerms,
      };
    })
    .catch((error) => {
      console.error("Login failed:", error);
      return { error: "Network error." };
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
      const contentType = res.headers.get("content-type");

      if (res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          return data;
        } else {
          return { message: await res.text() };
        }
      }

      // Handle error response
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed.");
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed.");
      }
    })
    .catch((error) => {
      console.error("Registration error:", error);
      throw error;
    });
};

/**
 * ✅ Accept the terms of service for a user
 * @param {string} email - User's email
 * @returns {Promise<string>} - Success message
 */
export const acceptTerms = (email) => {
  return fetch("/api/Auth/accept-terms", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((msg) => {
        throw new Error(msg || "Failed to accept terms.");
      });
    }
    return res.text();
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

/**
 * ✅ Fetch linked account status
 * @returns {Promise<{ steamLinked: boolean, epicLinked: boolean, minecraftLinked: boolean }>}
 */
export const getLinkedStatus = () => {
  const token = getToken();
  return fetch(`${apiUrl}/linked-status`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to get linked status.");
    }
    return res.json();
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
