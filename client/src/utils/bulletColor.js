export const getBulletColor = (subId) => {
  switch (subId) {
    case "single":
      return "red"; // Normal subscription
    case "golden":
      return "goldenrod"; // Golden Lynx
    case "diamond":
      return "teal"; // Diamond Lynx
    case "vibranium":
      return "purple"; // Vibranium Lynx
    default:
      return "gray"; // Default fallback color
  }
};
