export function getCategoryBadgeClass(category) {
  switch (category) {
    case "MMO Survival":
      return "badge-mmo-survival";
    case "Sandbox Simulation":
      return "badge-sandbox-simulation";
    case "Sandbox":
      return "badge-sandbox";
    case "Space Survival":
      return "badge-space-survival";
    default:
      return "bg-secondary";
  }
}
