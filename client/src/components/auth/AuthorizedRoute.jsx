import { Navigate } from "react-router-dom";

export const AuthorizedRoute = ({
  children,
  loggedInUser,
  roles = [],
  all = false,
}) => {
  // If user isn't logged in, navigate to login
  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }
  // Ensure roles exist and are in array format
  const userRoles = Array.isArray(loggedInUser.roles) ? loggedInUser.roles : [];

  // Authorization check
  const authed = roles.length
    ? all
      ? roles.every((r) => userRoles.includes(r)) // Requires all roles
      : roles.some((r) => userRoles.includes(r)) // Requires at least one role
    : true; // No roles required

  return authed ? children : <Navigate to="/login" />;
};
