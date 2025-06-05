const _apiUrl = "/api/dashboard";

/* ============================================================================
 * ✅ AUTH HEADER UTILITY
 * ========================================================================== */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================================
 * ✅ TICKET STATS DASHBOARD
 * ========================================================================== */

/**
 * ✅ Get ticket stats for current month
 * @returns {Promise<object>}
 */
export const getMonthlyTicketStats = () => {
  return fetch(`${_apiUrl}/ticket-stats`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching ticket stats:", error);
      throw error;
    });
};

/**
 * ✅ Get user stats for current month
 * @returns {Promise<object>}
 */
export const getMonthlyUserStats = () => {
  return fetch(`${_apiUrl}/user-stats`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching user stats:", error);
      throw error;
    });
};

/**
 * ✅ Get full payment report (slow, used for detailed reports)
 * @returns {Promise<object[]>}
 */
export const getFullPaymentsReport = () => {
  return fetch(`${_apiUrl}/payments-report`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching full payments report:", error);
      throw error;
    });
};

/**
 * ✅ Get recent payments for current month (fast, used for dashboard)
 * @returns {Promise<object[]>}
 */
export const getRecentMonthlyPayments = () => {
  return fetch(`${_apiUrl}/payments-recent`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching recent monthly payments:", error);
      throw error;
    });
};
