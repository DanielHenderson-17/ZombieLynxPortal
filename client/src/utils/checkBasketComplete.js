export const checkBasketComplete = async (ident, token) => {
  const maxAttempts = 30;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let attempts = 0;

  while (attempts < maxAttempts) {
    const res = await fetch(`/api/tebex/basket/${ident}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const { data } = await res.json();
      if (data.complete === true) {
        return true;
      }
    }

    attempts++;
    await delay(2000);
  }

  throw new Error("Purchase confirmation timed out.");
};
