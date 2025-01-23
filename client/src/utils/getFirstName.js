export const extractFirstName = (fullName) => {
  if (typeof fullName !== "string" || fullName.trim() === "") {
    return "Guest";
  }
  return fullName.trim().split(" ")[0];
};
