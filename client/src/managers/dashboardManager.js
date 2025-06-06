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

/**
 * ✅ Get user overview stats for the last 30 days
 * @returns {Promise<object>}
 */
export const getUserOverviewStats = () => {
  return fetch(`${_apiUrl}/user-overview-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching user overview stats:", error);
      throw error;
    });
};
/**
 * ✅ Get 30-day user activity chart (joins + leaves)
 * @returns {Promise<Array<{ date: string, joins: number, leaves: number }>>}
 */
export const getUserActivityChartData = () => {
  return fetch(`${_apiUrl}/user-activity-chart-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching user activity chart data:", error);
      throw error;
    });
};

export const getTicketOverviewStats = () => {
  return fetch(`${_apiUrl}/ticket-overview-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching ticket overview stats:", error);
      throw error;
    });
};

export const getTicketActivityChartData = () => {
  return fetch(`${_apiUrl}/ticket-activity-chart-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching ticket activity chart data:", error);
      throw error;
    });
};

/**
 * ✅ Get sales overview stats for the last 30 days
 * @returns {Promise<object>}
 */
export const getSalesOverviewStats = () => {
  return fetch(`${_apiUrl}/sales-overview-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching sales overview stats:", error);
      throw error;
    });
};

/**
 * ✅ Get 30-day sales chart data (daily revenue totals)
 * @returns {Promise<Array<{ date: string, revenue: number }>>}
 */
export const getSalesChartData = () => {
  return fetch(`${_apiUrl}/sales-chart-30days`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching sales chart data:", error);
      throw error;
    });
};
