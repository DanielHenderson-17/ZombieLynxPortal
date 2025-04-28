import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { NavLink as RRNavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { usePointsRefresher } from "../hooks/usePointsRefresher";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { formatDiscordName } from "../utils/formatDiscordName";
import { logout } from "../managers/authManager";
import {
  getUserProfiles,
  getUserMembership,
} from "../managers/userProfileManager";
import "../assets/styles/NavBar.css";
import zlgLogo from "../assets/zlg-logo.png";
import { getLinkedSteamAccount } from "../managers/steamAuthManager";
import { getLinkedDiscordAccount } from "../managers/discordAuthManager";
import { getUserNotifications } from "../managers/notificationManager";
import zlgCoin from "../assets/images/zlgCoin.png";
import buyPoints from "../assets/images/buyPoints.png";
import addPoints from "../assets/images/addPoints.png";
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
        {/* Logo */}
        <RRNavLink className="navbar-brand" to="/#home">
          <img
            className="zlg-logo"
            src={zlgLogo}
            alt="Zombie Lynx Gaming"
            style={{ transition: "transform 0.3s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </RRNavLink>

        {/* Desktop Menu */}
        <div className="d-none d-lg-flex align-items-center justify-content-end position-relative col-2">
          <Link
            to={`/shop`}
            className="mb-1"
            data-bs-toggle="tooltip"
            title="Shop"
            data-bs-placement="bottom"
            style={{ transition: "transform 0.3s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img src={addPoints} alt="" className="me-4 addPoints" />
          </Link>
          <Link
            to={`https://www.zlg.gg/discord`}
            data-bs-toggle="tooltip"
            title="Discord"
            data-bs-placement="bottom"
            style={{ transition: "transform 0.3s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i className="fa-brands fa-discord text-white fs-3 me-4"></i>
          </Link>
          <Link
            to="/#ServerListDisplay"
            data-bs-toggle="tooltip"
            title="Go to Servers"
            data-bs-placement="bottom"
            className="me-3"
            style={{ transition: "transform 0.3s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i className="fa-solid fa-gamepad text-white fs-3"></i>
          </Link>
          {!loggedInUser ? (
            <div
              className="p-0 d-flex justify-content-center align-items-center login-btn"
              onClick={() => navigate("/login")}
            >
              <p className="my-0 me-3 text-white">Login</p>{" "}
              <i className="bi bi-person-circle fs-2 text-white"></i>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center col-10 ms-2">
              <Link
                to="/member/notifications"
                className="nav-link ps-2 pe-2 position-relative border-start border-secondary"
              >
                <i className="fa-solid fa-envelope text-white fs-6 me-2"></i>
                {unreadNotifications > 0 && (
                  <span className="cart-badge rounded-circle text-white bg-danger">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              <Link
                to="/shop/cart"
                className="nav-link pe-2 ps-0 border-end border-secondary position-relative"
              >
                <i
                  className="fa-solid fa-cart-shopping text-white fs-6 me-2"
                  style={{ transition: "transform 0.3s" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
                {cartCount > 0 && (
                  <span className="cart-badge rounded-circle text-white bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="m-0 text-center col-8 my-2 ps-3">
                <h5 className="text-white text-center mb-1 navbar-first-name">
                  <div className="text-white text-center mb-1 navbar-first-name">
                    {discordAccount?.discordName
                      ? capitalizeFirstLetter(
                          formatDiscordName(discordAccount.discordName)
                        )
                      : loggedInUser?.firstName || "Guest"}
                  </div>
                </h5>

                <div className="d-flex align-items-center justify-content-between border border-secondary rounded-5 p-0 text-white col-md-10 col-12 mx-md-auto ms-0 position-relative">
                  <img src={zlgCoin} alt="" className="zlg-coin3" />
                  <div className="text-container points-container">
                    <p className="mb-0">{userPoints}</p>
                  </div>
                  <Link
                    to="/shop"
                    className="text-secondary buy-points3"
                    style={{ transition: "transform 0.3s" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img src={buyPoints} alt="" />
                  </Link>
                </div>
              </div>

              <img
                src={
                  discordAccount?.discordImgUrl ||
                  steamAccount?.steamImgUrl ||
                  `https://picsum.photos/seed/${randomSeed}/40/40`
                }
                alt="Profile"
                className="profile-img rounded-circle mx-3"
                onClick={() => setShowDropdown(!showDropdown)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu show profile-menu"
                  style={{ right: 0 }}
                >
                  <button
                    className="dropdown-item text-white d-flex justify-content-between"
                    onClick={() => navigate("/member")}
                  >
                    <p className="m-0">My Profile</p>
                    <i className="bi bi-person-circle text-white"></i>
                  </button>

                  <button
                    className="dropdown-item text-white d-flex justify-content-between"
                    onClick={() =>
                      window.open("https://www.zlg.gg/discord", "_blank")
                    }
                  >
                    <p className="m-0">Discord </p>
                    <i className="bi bi-discord text-white"></i>
                  </button>
                  <button
                    className="dropdown-item text-white d-flex justify-content-between"
                    onClick={handleLogout}
                  >
                    <p className="m-0">Logout </p>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Mobile Hamburger Menu */}
        <div className="d-flex d-lg-none align-items-center">
          <Link
            className="d-flex align-items-center text-decoration-none"
            to={`https://www.zlg.gg/discord`}
            data-bs-toggle="tooltip"
            title="Discord"
            data-bs-placement="bottom"
          >
            <i className="fa-brands fa-discord text-white fs-5 me-3"></i>
          </Link>
          <Link
            className="d-flex align-items-center text-decoration-none"
            to="/#ServerListDisplay"
            data-bs-toggle="tooltip"
            title="Go to Servers"
            data-bs-placement="bottom"
          >
            <i className="fa-solid fa-gamepad text-white fs-5 me-1"></i>
          </Link>
          <Link
            to="/member/notifications"
            className="nav-link ps-2 pe-0 position-relative"
          >
            <i className="fa-solid fa-envelope text-white fs-6 me-2"></i>
            {unreadNotifications > 0 && (
              <span className="cart-badge2 rounded-circle text-white bg-danger">
                {unreadNotifications}
              </span>
            )}
          </Link>

          <Link
            to="/shop/cart"
            className="nav-link pe-2 ps-1 position-relative"
          >
            <i className="fa-solid fa-cart-shopping text-white fs-6 me-2"></i>
            {cartCount > 0 && (
              <span className="cart-badge rounded-circle text-white bg-danger">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="btn btn-dark navbar-toggler border-0"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon fs-6"></span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && <div className="backdrop" onClick={() => setOpen(false)}></div>}

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu bg-dark text-white position-absolute top-0 end-0 vh-100 w-75 d-lg-none">
          <div className="d-flex justify-content-end p-3">
            <button
              className="btn btn-close btn-close-white"
              onClick={() => setOpen(false)}
            ></button>
          </div>
          <div className="p-4">
            {loggedInUser ? (
              <>
                {userProfile ? (
                  <div className="mb-4">{userProfile.firstName}</div>
                ) : (
                  <div className="mb-4">Loading...</div>
                )}
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    setOpen(false);
                    navigate("/member");
                  }}
                >
                  My Profile
                </button>
                <button
                  className="btn btn-danger w-100 mt-2"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div
                className="text-center text-white"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person-circle fs-1 mb-2"></i>
                <div className="fs-5">Login</div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
