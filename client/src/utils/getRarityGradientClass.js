/**
 * Returns the appropriate gradient background class for a given rarity.
 * Levels 5 and 10 will always return the orange gradient.
 *
 * @param {number} level - The reward level (1-10).
 * @param {string} rarity - The rarity string (e.g., "Common", "Epic").
 * @returns {string} A string of the Bootstrap background class.
 */
export function getRarityGradientClass(level, rarity) {
  switch (rarity?.toLowerCase()) {
    case "common":
      return "bg-common";
    case "uncommon":
      return "bg-uncommon";
    case "rare":
      return "bg-rare";
    case "epic":
      return "bg-purple";
    case "legendary":
      return "bg-legendary";
    default:
      return "bg-dark";
  }
}
