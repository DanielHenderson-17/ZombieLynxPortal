const _apiUrl = "/api/tebex";

// ✅ Helper: Get JWT Token from Local Storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get All Packages
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
