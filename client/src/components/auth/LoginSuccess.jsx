import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tryGetLoggedInUser } from "../../managers/authManager";

export default function LoginSuccess({ setLoggedInUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    tryGetLoggedInUser().then((user) => {
      if (user) {
        setLoggedInUser(user);
        navigate("/");
      } else {
        navigate("/login");
      }
    });
  }, [navigate, setLoggedInUser]);

  return <p>Logging you in...</p>;
}
