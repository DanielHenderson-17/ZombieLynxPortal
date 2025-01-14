// Sets the image for the game based on the game name
export const getGameImage = (gameName) => {
  switch (gameName) {
    case "Eco":
      return "/src/assets/images/eco.png";
    case "Empyrion":
      return "/src/assets/images/empyrion.png";
    case "Minecraft":
      return "/src/assets/images/minecraft.png";
    case "Palworld":
      return "/src/assets/images/palworld.png";
    case "Ark:SA":
      return "/src/assets/images/asa.png";
    case "Ark:SE":
      return "/src/assets/images/ase.png";
    default:
      return "/src/assets/images/default.png";
  }
};
