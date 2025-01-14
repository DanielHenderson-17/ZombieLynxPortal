import { useState, useEffect } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import { logout } from "../managers/authManager";
import { getUserProfiles } from "../managers/userProfileManager";
import "../assets/styles/NavBar.css";
import zlgLogo from "../assets/zlg-logo.png";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      getUserProfiles()
        .then((profiles) => {
          if (Array.isArray(profiles)) {
            const profile = profiles.find(
              (p) =>
                p.identityUserId === loggedInUser.id || p.id === loggedInUser.id
            );
            setUserProfile(profile);
          } else {
            if (
              profiles.identityUserId === loggedInUser.id ||
              profiles.id === loggedInUser.id
            ) {
              setUserProfile(profiles);
            } else {
              console.error("Profile does not match logged-in user");
            }
          }
        })
        .catch((error) =>
          console.error("Failed to fetch user profile:", error)
        );
    }
  }, [loggedInUser]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top p-0 mx-auto w-100 zlg-nav-bar bg-dark">
      <div className="container-fluid px-md-5 px-2">
        {/* Logo */}
        <RRNavLink className="navbar-brand" to="/">
          <img className="zlg-logo" src={zlgLogo} alt="Zombie Lynx Gaming" />
        </RRNavLink>

        {/* Desktop Menu */}
        <div className="d-none d-lg-flex align-items-center">
          {loggedInUser && (
            <>
              {userProfile ? (
                <span className="navbar-text me-3 text-white">
                  {userProfile.email}
                </span>
              ) : (
                <span className="navbar-text me-3 text-white">Loading...</span>
              )}
              <button
                className="btn btn-primary"
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

      {/* Backdrop (Dim Background) */}
      {open && <div className="backdrop" onClick={() => setOpen(false)}></div>}

      {/* Slide-Out Mobile Menu */}
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
              <div className="mb-4">{userProfile.email}</div>
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
