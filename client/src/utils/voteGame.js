// utils/voteGame.js

export const getVoteGameImage = (gameString) => {
  const normalized = gameString.toLowerCase();

  if (normalized.includes("eco")) return "/images/eco3.png";
  if (normalized.includes("empyrion")) return "/images/empyrion3.png";
  if (normalized.includes("minecraft")) return "/images/minecraft3.png";
  if (normalized.includes("palworld")) return "/images/palworld3.png";
  if (
    normalized.includes("ark:sa") ||
    normalized.includes("ark: survival ascended")
  )
    return "/images/asa3.png";
  if (
    normalized.includes("ark:se") ||
    normalized.includes("ark: survival evolved")
  )
    return "/images/ase3.png";
  if (normalized.includes("discord")) return "/images/discord3.png";

  return "/images/default.png";
};
