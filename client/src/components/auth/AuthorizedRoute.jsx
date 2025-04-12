import { Navigate, useLocation } from "react-router-dom";

export const AuthorizedRoute = ({
  children,
  loggedInUser,
  roles = [],
  all = false,
}) => {
  const location = useLocation();

  // If user isn't logged in, redirect to login with original location saved
  if (!loggedInUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = Array.isArray(loggedInUser.roles) ? loggedInUser.roles : [];

  const authed = roles.length
    ? all
      ? roles.every((r) => userRoles.includes(r))
      : roles.some((r) => userRoles.includes(r))
    : true;

  return authed ? children : <Navigate to="/login" />;
};
