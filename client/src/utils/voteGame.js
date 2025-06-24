import ase from "../assets/vote/ase3.webp";
import asa from "../assets/vote/asa3.webp";
import eco from "../assets/vote/eco3.webp";
import empyrion from "../assets/vote/empyrion3.webp";
import minecraft from "../assets/vote/minecraft3.webp";
import palworld from "../assets/vote/palworld3.webp";
import discord from "../assets/vote/discord3.webp";
import defaultImg from "../assets/vote/default.webp";

export const getVoteGameImage = (gameString) => {
  const normalized = gameString.toLowerCase();

  if (normalized.includes("eco")) return eco;
  if (normalized.includes("empyrion")) return empyrion;
  if (normalized.includes("minecraft")) return minecraft;
  if (normalized.includes("palworld")) return palworld;
  if (
    normalized.includes("ark:sa") ||
    normalized.includes("ark: survival ascended")
  )
    return asa;
  if (
    normalized.includes("ark:se") ||
    normalized.includes("ark: survival evolved")
  )
    return ase;
  if (normalized.includes("discord")) return discord;

  return defaultImg;
};
