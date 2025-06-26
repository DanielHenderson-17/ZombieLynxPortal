// utils/getCompatibilityGame.js
import { compatibilityImageMap } from "./compatibilityImageMap";

export const getCompatibilityGame = (gameName) => {
  return compatibilityImageMap[gameName];
};
