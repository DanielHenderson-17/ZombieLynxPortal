export const formatDiscordName = (discordName) => {
  if (typeof discordName !== "string" || discordName.trim() === "") {
    return "Guest";
  }

  // Remove the `#` and numbers at the end
  const cleanedName = discordName.split("#")[0];

  // Capitalize the first letter
  return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
};
