export const PROMO_PACKAGE_ID = 6036704;

export const isPromoLocked = (promoReceivedDate) => {
  if (!promoReceivedDate) return false;
  const last = new Date(promoReceivedDate);
  const now = new Date();
  const diffInMs = now - last;
  return diffInMs < 31 * 24 * 60 * 60 * 1000;
};

export const getPromoUnlockDate = (promoReceivedDate) => {
  if (!promoReceivedDate) return null;
  const unlockDate = new Date(promoReceivedDate);
  unlockDate.setDate(unlockDate.getDate() + 31);
  return unlockDate.toLocaleDateString();
};
