import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tryGetLoggedInUser } from "../../managers/authManager";

export default function LoginSuccess({ setLoggedInUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Verify if the user is logged in after redirect
    tryGetLoggedInUser().then((user) => {
      if (user) {
        setLoggedInUser(user); // Set user in state
        navigate("/"); // Redirect to homepage
      } else {
        navigate("/login"); // If not logged in, go back to login
      }
    });
  }, [navigate, setLoggedInUser]);

  return <p>Logging you in...</p>;
}
