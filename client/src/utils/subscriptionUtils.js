export function getMembershipTier(membership) {
  const rawTier = membership?.sub?.split(":")[0];
  return ["Gold", "Diamond", "Vibranium"].includes(rawTier)
    ? rawTier
    : "Standard";
}

export function getTierGradient(tier) {
  return (
    {
      Gold: "linear-gradient(to top, #fad346, black)",
      Diamond: "linear-gradient(to top, #22a2b1, black)",
      Vibranium: "linear-gradient(to top, #cd70fd, black)",
    }[tier] || "linear-gradient(to top, rgb(150, 6, 6), black)"
  );
}
