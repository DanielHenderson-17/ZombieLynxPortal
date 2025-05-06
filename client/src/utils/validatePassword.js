export const validatePassword = (pwd) => {
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(pwd);
  const hasNoSpaces = /^\S+$/.test(pwd);
  const isLongEnough = pwd.length >= 8;

  if (!isLongEnough) return "Password must be at least 8 characters long.";
  if (!hasUpperCase)
    return "Password must contain at least one uppercase letter.";
  if (!hasSpecialChar) return "Password must include a special character.";
  if (!hasNoSpaces) return "Password must not contain spaces.";

  return "";
};
