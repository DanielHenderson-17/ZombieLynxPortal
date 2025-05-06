export function findSubscriptionByName(packages, tier) {
  const names = {
    Gold: "Golden Lynx Subscription (650ZP & Discord Role 1 month Recurring)",
    Diamond:
      "Diamond Lynx Subscription  (1300ZP & Discord Role 1 month Recurring)",
    Vibranium:
      "Vibranium Lynx Subscription  (1950ZP & Discord Role 1 month Recurring)",
  };
  return packages.find((p) => p.name === names[tier]);
}
