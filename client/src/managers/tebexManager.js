const _apiUrl = "/api/tebex";

/* ============================================================================
 * ✅ AUTH HEADER UTILITY
 * ========================================================================== */

/**
 * ✅ Get Authorization headers with JWT token
 * @returns {object}
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================================
 * ✅ PACKAGE MANAGEMENT
 * ========================================================================== */

/**
 * ✅ Get all Tebex packages
 * @returns {Promise<object[]>}
 */
export const getPackages = () => {
  return fetch(`${_apiUrl}/packages`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching Tebex packages:", error);
      throw error;
    });
};

/* ============================================================================
 * ✅ BASKET OPERATIONS
 * ========================================================================== */

/**
 * ✅ Create a new Tebex basket
 * @param {object[]} items - Cart items
 * @param {string} token - JWT token
 * @returns {Promise<object>}
 */
export const createBasket = (items, token) => {
  return fetch("/api/tebex/create-basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to create basket");
    return res.json();
  });
};

/**
 * ✅ Authenticate the Tebex basket with the user
 * @param {object} ident - Basket identifier
 * @param {string} token - JWT token
 * @returns {Promise<object>}
 */
export const authenticateBasket = (ident, token) => {
  return fetch("/api/tebex/authenticate-basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ident),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to authenticate basket");
    return res.json();
  });
};

/**
 * ✅ Add a package to an existing Tebex basket
 * @param {string} ident - Basket identifier
 * @param {object} item - Package item to add
 * @param {string} token - JWT token
 * @returns {Promise<object>}
 */
export const addPackageToBasket = async (ident, item, token) => {
  const response = await fetch(`/api/tebex/add-package/${ident}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to add package");
    error.data = result;
    throw error;
  }

  return result;
};
