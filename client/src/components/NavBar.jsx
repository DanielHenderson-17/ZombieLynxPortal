import { useState, useEffect, useRef } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import { logout } from "../managers/authManager";
import { getUserProfiles } from "../managers/userProfileManager";
import "../assets/styles/NavBar.css";
import zlgLogo from "../assets/zlg-logo.png";
import { getLinkedSteamAccount } from "../managers/steamAuthManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [steamAccount, setSteamAccount] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [randomSeed, setRandomSeed] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (loggedInUser) {
      getUserProfiles()
        .then((profiles) => {
          let profile = null;

          if (Array.isArray(profiles)) {
            profile = profiles.find(
              (p) =>
                p.email === loggedInUser.email ||
                p.userId === loggedInUser.id ||
                p.id === loggedInUser.id
            );
          } else if (profiles) {
            if (
              profiles.email === loggedInUser.email ||
              profiles.userId === loggedInUser.id ||
              profiles.id === loggedInUser.id
            ) {
              profile = profiles;
            }
          }

          if (profile) {
            setUserProfile(profile);
          } else {
            console.error("❗ Profile does not match logged-in user", profiles);
          }
        })
        .catch((error) =>
          console.error("Failed to fetch user profile:", error)
        );
    }
  }, [loggedInUser]);

  useEffect(() => {
    const generateRandomSeed = () => Math.floor(Math.random() * 1000);
    setRandomSeed(generateRandomSeed());

    const fetchSteamAccount = async () => {
      try {
        const updatedSteamAccount = await getLinkedSteamAccount();
        if (
          updatedSteamAccount &&
          updatedSteamAccount.steamImgUrl !== steamAccount?.steamImgUrl
        ) {
          setSteamAccount(updatedSteamAccount);
        }
      } catch (error) {
        console.error("Error fetching Steam account:", error);
      }
    };

    if (loggedInUser) {
      fetchSteamAccount();
      const intervalId = setInterval(fetchSteamAccount, 60000);
      return () => clearInterval(intervalId);
    }
  }, [loggedInUser, steamAccount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top p-0 mx-auto w-100 zlg-nav-bar bg-dark">
      <div className="container-fluid px-md-5 px-2">
        {/* Logo */}
        <RRNavLink className="navbar-brand" to="/">
          <img className="zlg-logo" src={zlgLogo} alt="Zombie Lynx Gaming" />
        </RRNavLink>
        {/* Desktop Menu */}
        <div className="d-none d-lg-flex align-items-center position-relative">
          {!loggedInUser ? (
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          ) : (
            <>
              <img
                src={
                  steamAccount?.steamImgUrl ||
                  `https://picsum.photos/seed/${randomSeed}/40/40`
                }
                alt="Profile"
                className="profile-img rounded-circle"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu show mt-2"
                  style={{ right: 0 }}
                >
                  <button
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      logout().then(() => {
                        setLoggedInUser(null);
                        setShowDropdown(false);
                      });
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
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
              onClick={(e) => {
                e.preventDefault();
                logout().then(() => {
                  setLoggedInUser(null);
                  setOpen(false);
                });
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
