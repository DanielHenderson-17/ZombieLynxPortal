import { useCallback, useEffect, useState } from "react";
import {
  getToken,
  isJwtExpired,
  logout,
  tryGetLoggedInUser,
} from "./managers/authManager";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import ApplicationViews from "./components/ApplicationViews";
import { servicesOffline } from "./config/siteMode";
import { CartProvider } from "./contexts/CartContext";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(servicesOffline ? null : undefined);
  const location = useLocation();
  const navigate = useNavigate();

  const handleExpiredSession = useCallback(() => {
    if (servicesOffline) return;
    const token = getToken();
    if (!token || !isJwtExpired(token)) return;

    logout().then(() => {
      setLoggedInUser(null);
      alert("You have been logged out due to inactivity. Please log in again.");
      navigate("/login");
    });
  }, [navigate]);

  // ✅ Try to restore the user session on page load
  useEffect(() => {
    if (servicesOffline) return;
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

  // Check for token expiration on route change
  useEffect(() => {
    handleExpiredSession();
  }, [handleExpiredSession, location]);

  // Periodic check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleExpiredSession();
    }, 60000);

    return () => clearInterval(interval);
  }, [handleExpiredSession]);

  // ✅ Show a spinner while checking for the logged-in user
  if (loggedInUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-[var(--color-text)]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-secondary)] border-t-transparent"
          role="status"
          aria-label="Loading"
        />
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

