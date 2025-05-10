export const getGameImage = (gameName) => {
  switch (gameName) {
    case "Eco":
      return "/images/eco3.png";
    case "Empyrion":
      return "/images/empyrion3.png";
    case "Minecraft":
      return "/images/minecraft3.png";
    case "Palworld":
      return "/images/palworld3.png";
    case "Ark:SA":
      return "/images/asa3.png";
    case "Ark:SE":
      return "/images/ase3.png";
    case "Discord Issue":
      return "/images/discord3.png";
    default:
      return "/images/default.png";
  }
};
