// Sets the image for the game based on the game name
export const getGameImage = (gameName) => {
  switch (gameName) {
    case "Eco":
      return "/src/assets/images/eco3.png";
    case "Empyrion":
      return "/src/assets/images/empyrion3.png";
    case "Minecraft":
      return "/src/assets/images/minecraft3.png";
    case "Palworld":
      return "/src/assets/images/palworld3.png";
    case "Ark:SA":
      return "/src/assets/images/asa3.png";
    case "Ark:SE":
      return "/src/assets/images/ase3.png";
    case "Discord":
      return "/src/assets/images/discord3.png";
    default:
      return "/src/assets/images/default.png";
  }
};
