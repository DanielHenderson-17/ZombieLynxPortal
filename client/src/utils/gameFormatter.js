// Sets the image for the game based on the game name
export const getGameImage = (gameName) => {
  switch (gameName) {
    case "Eco":
      return "/src/assets/images/eco2.png";
    case "Empyrion":
      return "/src/assets/images/empyrion2.png";
    case "Minecraft":
      return "/src/assets/images/minecraft2.png";
    case "Palworld":
      return "/src/assets/images/palworld2.png";
    case "Ark:SA":
      return "/src/assets/images/asa2.png";
    case "Ark:SE":
      return "/src/assets/images/ase2.png";
    case "Discord":
      return "/src/assets/images/discord2.png";
    default:
      return "/src/assets/images/default.png";
  }
};
