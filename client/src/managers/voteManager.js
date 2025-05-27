const _apiUrl = "/api/vote";

/* ============================================================================
 * ✅ AUTH HEADER UTILITY
 * ========================================================================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================================
 * ✅ VOTE FETCHING
 * ========================================================================= */

/**
 * ✅ Ping the vote controller
 * @returns {Promise<string>}
 */
export const pingVoteController = () => {
  return fetch(`${_apiUrl}/ping`)
    .then((res) => (res.ok ? res.text() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("VoteController ping failed:", error);
      throw error;
    });
};

/**
 * ✅ Get active votes
 * @returns {Promise<object[]>}
 */
export const getActiveVotes = () => {
  return fetch(`${_apiUrl}/active`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching active votes:", error);
      throw error;
    });
};

/**
 * ✅ Get expired votes
 * @returns {Promise<object[]>}
 */
export const getExpiredVotes = () => {
  return fetch(`${_apiUrl}/expired`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching expired votes:", error);
      throw error;
    });
};

/**
 * ✅ Get all available games
 * @returns {Promise<object[]>}
 */
export const getGames = () => {
  return fetch("/api/games", {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching games:", error);
      throw error;
    });
};

/**
 * ✅ Get vote results by ID
 * @param {number} voteId
 * @returns {Promise<object>}
 */
export const getVoteResults = (voteId) => {
  return fetch(`${_apiUrl}/${voteId}/results`, {
    headers: getAuthHeaders(),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .catch((error) => {
      console.error("Error fetching vote results:", error);
      throw error;
    });
};

/* ============================================================================
 * ✅ VOTE ACTIONS
 * ========================================================================= */

/**
 * ✅ Submit a vote
 * @param {number} voteId
 * @param {boolean} votedFor
 * @returns {Promise<string>}
 */
export const submitVote = (voteId, votedFor) => {
  return fetch(`${_apiUrl}/${voteId}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(votedFor),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((msg) => {
        throw new Error(`Error submitting vote: ${msg}`);
      });
    }
    return res.text();
  });
};

/**
 * ✅ Admin-only: Create a new game
 * @param {object} game { name: string, platform: string }
 * @returns {Promise<object>}
 */
export const createGame = (game) => {
  return fetch(`${_apiUrl}/create-game`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(game),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(`Error creating game: ${error.message}`);
      });
    }
    return res.json();
  });
};

/**
 * ✅ Admin-only: Create a new vote
 * @param {object} vote { gameId: number, title: string, description?: string, expiresAt?: string }
 * @returns {Promise<object>}
 */
export const createVote = (vote) => {
  return fetch(`${_apiUrl}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(vote),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(`Error creating vote: ${error.message}`);
      });
    }
    return res.json();
  });
};
