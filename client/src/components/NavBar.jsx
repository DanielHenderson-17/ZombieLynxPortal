import { useState, useEffect, useRef } from "react";
import { NavLink as RRNavLink, Link, useNavigate } from "react-router-dom";
import { logout } from "../managers/authManager";
import { getUserProfiles } from "../managers/userProfileManager";
import "../assets/styles/NavBar.css";
import zlgLogo from "../assets/zlg-logo.png";
import { getLinkedSteamAccount } from "../managers/steamAuthManager";
import { getLinkedDiscordAccount } from "../managers/discordAuthManager";
import zlgCoin from "../assets/images/zlgCoin.png";
import buyPoints from "../assets/images/buyPoints.png";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [steamAccount, setSteamAccount] = useState(null);
  const [discordAccount, setDiscordAccount] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [randomSeed, setRandomSeed] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    if (!loggedInUser) {
      console.log("No user is logged in");
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
        }
      })
      .catch((error) => console.error("Failed to fetch user profile:", error));
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

  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate("/");
    });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top p-0 mx-auto col-12 zlg-nav-bar bg-dark">
      <div className="container-fluid px-md-5 px-2">
        {/* Logo */}
        <RRNavLink className="navbar-brand" to="/">
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
          {!loggedInUser ? (
            <div
              className="p-0 d-flex justify-content-center align-items-center login-btn"
              onClick={() => navigate("/login")}
            >
              <p className="my-0 me-3 text-secondary">Login</p>{" "}
              <i className="bi bi-person-circle fs-2 text-secondary"></i>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center col-10">
              <div className="m-0 text-center col-8 ps-2 pe-4 my-2 border-end border-secondary">
                <h5 className="text-white text-center mb-1">
                  {loggedInUser.firstName}
                </h5>

                <div className="d-flex align-items-center justify-content-between border border-secondary rounded-5 p-0 text-white col-md-10 col-12 mx-md-auto ms-0 position-relative">
                  <img src={zlgCoin} alt="" className="zlg-coin3" />
                  <div className="text-container">
                    <p className="mb-0">1455</p>
                  </div>
                  <Link
                    to="https://zlg.gg/aseshop"
                    className="text-secondary buy-points3"
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
                style={{
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
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
          {loggedInUser && (
            <button
              className="btn btn-dark navbar-toggler border-0"
              type="button"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}
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
            {userProfile ? (
              <div className="mb-4">{userProfile.firstName}</div>
            ) : (
              <div className="mb-4">Loading...</div>
            )}
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/member")}
            >
              My Profile
            </button>
            <button
              className="btn btn-danger w-100 mt-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
