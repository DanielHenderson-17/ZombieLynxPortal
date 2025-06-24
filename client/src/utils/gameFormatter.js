import ase from "../assets/tickets/ase3.webp";
import asa from "../assets/tickets/asa3.webp";
import eco from "../assets/tickets/eco3.webp";
import empyrion from "../assets/tickets/empyrion3.webp";
import minecraft from "../assets/tickets/minecraft3.webp";
import palworld from "../assets/tickets/palworld3.webp";
import discord from "../assets/tickets/discord3.webp";
import defaultImg from "../assets/tickets/default.webp";

export const getGameImage = (gameName) => {
  switch (gameName) {
    case "Eco":
      return eco;
    case "Empyrion":
      return empyrion;
    case "Minecraft":
      return minecraft;
    case "Palworld":
      return palworld;
    case "Ark:SA":
      return asa;
    case "Ark:SE":
      return ase;
    case "Discord Issue":
      return discord;
    default:
      return defaultImg;
  }
};
