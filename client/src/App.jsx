import { useEffect, useState } from "react";
import {
  getToken,
  isJwtExpired,
  logout,
  tryGetLoggedInUser,
} from "./managers/authManager";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "reactstrap";
import ApplicationViews from "./components/ApplicationViews";
import { CartProvider } from "./contexts/CartContext";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Try to restore the user session on page load
  useEffect(() => {
    tryGetLoggedInUser()
      .then((user) => {
        setLoggedInUser(user);
      })
      .catch(() => {
        setLoggedInUser(null);
      });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // ✅ Check for token expiration on route change
  useEffect(() => {
    const token = getToken();
    if (token && isJwtExpired(token)) {
      logout().then(() => {
        setLoggedInUser(null);
        alert(
          "You have been logged out due to inactivity. Please log in again."
        );
        navigate("/login");
      });
    }
  }, [location]);

  // ✅ Periodic check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && isJwtExpired(token)) {
        logout().then(() => {
          setLoggedInUser(null);
          alert(
            "You have been logged out due to inactivity. Please log in again."
          );
          navigate("/login");
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Show a spinner while checking for the logged-in user
  if (loggedInUser === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <CartProvider>
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </CartProvider>
  );
}

export default App;
