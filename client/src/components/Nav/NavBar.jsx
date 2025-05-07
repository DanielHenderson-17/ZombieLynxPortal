import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { NavLink as RRNavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { usePointsRefresher } from "../../hooks/usePointsRefresher";
import { logout } from "../../managers/authManager";
import {
  getUserProfiles,
  getUserMembership,
} from "../../managers/userProfileManager";
import "../../assets/styles/NavBar.css";
import zlgLogo from "../../assets/zlg-logo.png";
import { getLinkedSteamAccount } from "../../managers/steamAuthManager";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
import { getUserNotifications } from "../../managers/notificationManager";
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";
import * as bootstrap from "bootstrap";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [steamAccount, setSteamAccount] = useState(null);
  const [discordAccount, setDiscordAccount] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [randomSeed, setRandomSeed] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [userPoints, setUserPoints] = useState(0);
  usePointsRefresher(setUserPoints, loggedInUser);

  const cartCount =
    (cartItems.subscription ? 1 : 0) +
    cartItems.single.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    getUserProfiles()
      .then((profile) => {
        if (!profile || typeof profile !== "object") {
          console.error(
            "Unexpected response type, expected an object:",
            profile
          );
          return;
        }
        if (
          profile.email === loggedInUser.email ||
          profile.userId === loggedInUser.id ||
          profile.id === loggedInUser.id
        ) {
          setUserProfile(profile);
          getUserMembership()
            .then((membership) => {
              if (membership?.points != null) {
                setUserPoints(membership.points);
              }
            })
            .catch((error) =>
              console.error("Failed to fetch membership info:", error)
            );
        }
      })
      .catch((error) => console.error("Failed to fetch user profile:", error));
  }, [loggedInUser]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!loggedInUser) return;
      try {
        const data = await getUserNotifications();
        const unreadCount = data.filter((n) => !n.isRead).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
    const intervalId = setInterval(fetchUnreadNotifications, 60000);

    const handleStorageChange = (e) => {
      if (e.key === "zlg-notifications-updated") {
        fetchUnreadNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loggedInUser]);

  // Fetch Steam account
  useEffect(() => {
    const generateRandomSeed = () => Math.floor(Math.random() * 1000);
    setRandomSeed(generateRandomSeed());

    const fetchLinkedAccounts = async () => {
      try {
        const updatedSteamAccount = await getLinkedSteamAccount();
        const updatedDiscordAccount = await getLinkedDiscordAccount();

        if (updatedSteamAccount?.steamImgUrl !== steamAccount?.steamImgUrl) {
          setSteamAccount(updatedSteamAccount);
        }

        if (
          updatedDiscordAccount?.discordImgUrl !== discordAccount?.discordImgUrl
        ) {
          setDiscordAccount(updatedDiscordAccount);
        }
      } catch (error) {
        console.error("Error fetching linked accounts:", error);
      }
    };

    if (loggedInUser) {
      fetchLinkedAccounts();
      const intervalId = setInterval(fetchLinkedAccounts, 60000);
      return () => clearInterval(intervalId);
    }
  }, [loggedInUser, steamAccount, discordAccount]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const location = useLocation();

  // Scroll to hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -200;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate("/");
    });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top p-0 mx-auto col-12 zlg-nav-bar bg-dark ps-2 pe-md-4 pe-2">
      <div className="container-fluid px-md-5 px-2">
        <RRNavLink className="navbar-brand" to="/#home">
          <img className="zlg-logo" src={zlgLogo} alt="Zombie Lynx Gaming" />
        </RRNavLink>

        <NavBarDesktop
          loggedInUser={loggedInUser}
          steamAccount={steamAccount}
          discordAccount={discordAccount}
          unreadNotifications={unreadNotifications}
          cartCount={cartCount}
          userPoints={userPoints}
          handleLogout={handleLogout}
          randomSeed={randomSeed}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          dropdownRef={dropdownRef}
        />

        <NavBarMobile
          loggedInUser={loggedInUser}
          userProfile={userProfile}
          unreadNotifications={unreadNotifications}
          cartCount={cartCount}
          open={open}
          setOpen={setOpen}
          handleLogout={handleLogout}
          discordAccount={discordAccount}
          steamAccount={steamAccount}
          randomSeed={randomSeed}
        />
      </div>
    </nav>
  );
}
