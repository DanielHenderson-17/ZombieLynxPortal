import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  linkSteamAccount,
  unlinkSteamAccount,
  getLinkedSteamAccount,
  getMainJwtToken,
} from "../../managers/steamAuthManager";
import "../../assets/styles/Member.css";
import { generateRandomSeed } from "../../utils/generateRandomSeed.js";
import tierOne from "../../assets/images/tierOne.png";
import tierTwo from "../../assets/images/tierTwo.png";
import tierThree from "../../assets/images/tierThree.png";
import zlgCoin from "../../assets/images/zlgCoin.png";

export default function Member({ loggedInUser }) {
  const [steamAccount, setSteamAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [randomSeed, setRandomSeed] = useState(null);

  // Mock for other accounts
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const availableAccounts = [
    { name: "Epic", icon: "../../../../public/epicIcon.png" },
    { name: "Discord", icon: "../../../../public/discordIcon.png" },
    { name: "Steam", icon: "../../../../public/steamIcon.png" },
  ];

  useEffect(() => {
    fetchLinkedAccount();
  }, [refreshTrigger]);

  useEffect(() => {
    setRandomSeed(generateRandomSeed());
  }, []);

  const fetchLinkedAccount = () => {
    if (loggedInUser && getMainJwtToken()) {
      setLoading(true);
      getLinkedSteamAccount()
        .then((data) => {
          if (data?.steamId) {
            setSteamAccount(data);
            setLinkedAccounts([{ name: "Steam", ...data }]);
          } else {
            setSteamAccount(null);
            setLinkedAccounts([]);
          }
        })
        .catch(() => setError("Failed to load your Steam account."))
        .finally(() => setLoading(false));
    }
  };

  const handleLinkAccount = (platform) => {
    if (!getMainJwtToken()) {
      setError("Please log in to link your account.");
      return;
    }

    setLoading(true);

    if (platform === "Steam") {
      linkSteamAccount(() => {
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    }
    // Mock link for other platforms
    else {
      setLinkedAccounts((prev) => [
        ...prev,
        { name: platform, platformName: platform, imgUrl: "/default-icon.png" },
      ]);
      setLoading(false);
    }
  };

  const handleUnlinkAccount = (platform) => {
    setLoading(true);

    if (platform === "Steam") {
      unlinkSteamAccount(() => {
        setSteamAccount(null);
        setLinkedAccounts((prev) => prev.filter((acc) => acc.name !== "Steam"));
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    }
    // Mock unlink for other platforms
    else {
      setLinkedAccounts((prev) => prev.filter((acc) => acc.name !== platform));
      setLoading(false);
    }
  };

  return (
    <div className="member-layout mt-5 pt-3 w-100 px-0">
      <div className="member-container">
        <div className="member-header d-flex justify-content-between align-items-start">
          {/* LEFT SIDE - Profile Info */}
          <div className="profile-info col-5 d-flex justify-content-center h-100">
            {/* Profile Container: Image -> Name -> Points */}
            <div className="d-flex justify-content-end align-items-end img-name-points col-6">
              <div>
                {/* Profile Image */}
                <div className="hexagon mb-3">
                  <img
                    src={
                      steamAccount?.steamImgUrl ||
                      `https://picsum.photos/seed/${randomSeed}/100/100`
                    }
                    alt="Profile"
                    className="profile-img"
                  />
                </div>

                {/* Username */}
                <h3 className="text-white">
                  {loggedInUser?.firstName || "Guest"}
                </h3>

                {/* Points */}
                <p className="text-white">Points: 1455</p>
              </div>
            </div>

            {/* Linked/Unlinked Accounts */}
            <div className="d-flex flex-column justify-content-start account-section mt-2 ms-4 col-5">
              {/* Add Accounts Section */}
              <div
                className={`add-accounts mb-3 w-50 ${
                  availableAccounts.filter(
                    (acc) =>
                      !linkedAccounts.some((linked) => linked.name === acc.name)
                  ).length === 0
                    ? "d-none"
                    : ""
                }`}
              >
                <div className="text-white text-start align-items-center mb-1">
                  <i className="bi bi-plus fs-6 my-0"></i>Add Accounts
                </div>
                <div className="d-flex gap-2 rounded px-2 py-1 available-accounts">
                  {availableAccounts
                    .filter(
                      (acc) =>
                        !linkedAccounts.some(
                          (linked) => linked.name === acc.name
                        )
                    )
                    .map((acc) => (
                      <button
                        key={acc.name}
                        className="btn px-1 py-1 add-btn"
                        onClick={() => handleLinkAccount(acc.name)}
                        disabled={loading}
                      >
                        <img
                          src={acc.icon}
                          alt={`${acc.name} Icon`}
                          style={{ width: "25px", height: "25px" }}
                        />
                      </button>
                    ))}
                </div>
              </div>

              {/* Linked Accounts Section */}
              <div
                className={`linked-accounts ${
                  availableAccounts.filter(
                    (acc) =>
                      !linkedAccounts.some((linked) => linked.name === acc.name)
                  ).length === 0
                    ? "mt-4"
                    : ""
                }`}
              >
                <div className="text-white text-start mb-1">
                  <i className="bi bi-link-45deg"></i>Linked Accounts
                </div>
                {linkedAccounts.length === 0 ? (
                  <p className="text-white">No accounts linked.</p>
                ) : (
                  linkedAccounts.map((acc) => (
                    <div
                      key={acc.name}
                      className="d-flex align-items-center justify-content-between linked-back rounded mb-2"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            availableAccounts.find((a) => a.name === acc.name)
                              ?.icon
                          }
                          alt={`${acc.name} Icon`}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "12px",
                          }}
                        />
                        <div>
                          <p className="mb-0 text-white text-start">
                            {acc.steamName || acc.name}
                          </p>
                          {/* <small className="text-muted">
                            {acc.platformName}
                          </small> */}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-link text-secondary unlink-btn"
                        onClick={() => handleUnlinkAccount(acc.name)}
                        disabled={loading}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Shop */}
          <div className="shop-popular col-7 d-flex justify-content-center align-items-center mt-3">
            <div className="card p-1">
              <div className="card-body p-1">
                <img src={tierOne} alt="" />
                <p className="card-text mb-1 mt-3">
                  <img src={zlgCoin} alt="" className="zlg-coin me-1" />
                  1100
                </p>
                <button
                  className="btn btn-success w-50"
                  onClick={() =>
                    (window.location.href = "https://zlg.gg/aseshop")
                  }
                >
                  Buy
                </button>
              </div>
            </div>
            <div className="card p-1 mx-3 card-back">
              <div className="card-body p-1">
                <img src={tierTwo} alt="" />
                <p className="card-text mb-1 mt-3">
                  <img src={zlgCoin} alt="" className="zlg-coin me-1" />
                  4600
                </p>
                <button
                  className="btn btn-success w-50"
                  onClick={() =>
                    (window.location.href = "https://zlg.gg/aseshop")
                  }
                >
                  Buy
                </button>
              </div>
            </div>
            <div className="card p-1">
              <div className="card-body p-1">
                <img src={tierThree} alt="" />
                <p className="card-text mb-1 mt-3">
                  <img src={zlgCoin} alt="" className="zlg-coin me-1" />
                  12000
                </p>
                <button
                  className="btn btn-success w-50"
                  onClick={() =>
                    (window.location.href = "https://zlg.gg/aseshop")
                  }
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        {/* Navigation */}
        <nav className="d-flex justify-content-start member-nav">
          <div className="col-6 d-flex justify-content-end">
            <NavLink
              to="stats"
              className={({ isActive }) =>
                `mx-4 text-white text-decoration-none ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-bar-chart-fill me-1"></i>Stats
            </NavLink>
            <NavLink
              to="shop"
              className={({ isActive }) =>
                `me-4 text-white text-decoration-none ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-bag-plus-fill me-1"></i>Shop
            </NavLink>
            <NavLink
              to="tickets"
              className={({ isActive }) =>
                `text-white me-4 text-decoration-none ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-ticket-fill me-1"></i>Tickets
            </NavLink>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `text-white me-4 text-decoration-none ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-envelope-fill me-1"></i>Notifications
            </NavLink>
          </div>
        </nav>
      </div>

      <div className="member-content">
        <Outlet />
      </div>
    </div>
  );
}
