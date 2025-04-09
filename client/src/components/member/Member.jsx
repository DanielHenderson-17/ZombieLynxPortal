import {
  NavLink,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  linkSteamAccount,
  unlinkSteamAccount,
  getLinkedSteamAccount,
  getMainJwtToken,
} from "../../managers/steamAuthManager";
import {
  linkDiscordAccount,
  unlinkDiscordAccount,
  getLinkedDiscordAccount,
} from "../../managers/discordAuthManager";
import {
  getLinkedMinecraftAccount,
  unlinkMinecraftAccount,
  openMinecraftAuthWindow,
} from "../../managers/minecraftAuthManager";
import {
  getLinkedEpicAccount,
  unlinkEpicAccount,
  openEpicAuthWindow,
} from "../../managers/epicAuthManager";
import "../../assets/styles/Member.css";
import { generateRandomSeed } from "../../utils/generateRandomSeed.js";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter.js";
import { formatDiscordName } from "../../utils/formatDiscordName.js";
import tierOne from "../../assets/images/tierOne.png";
import tierTwo from "../../assets/images/tierTwo.png";
import tierThree from "../../assets/images/tierThree.png";
import zlgCoin from "../../assets/images/zlgCoin.png";
import buyPoints from "../../assets/images/buyPoints.png";

export default function Member({ loggedInUser }) {
  const [steamAccount, setSteamAccount] = useState(null);
  const [discordAccount, setDiscordAccount] = useState(null);
  const [minecraftAccount, setMinecraftAccount] = useState(null);
  const [epicAccount, setEpicAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [randomSeed, setRandomSeed] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock for other accounts
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const availableAccounts = [
    { name: "Epic", icon: "/epicIcon.png" },
    { name: "Discord", icon: "/discordIcon.png" },
    { name: "Steam", icon: "/steamIcon.png" },
    { name: "Minecraft", icon: "/minecraftIcon.png" },
  ];

  // Generate a random seed once when the component mounts
  useEffect(() => {
    setRandomSeed(generateRandomSeed());
  }, []);

  // Redirect to /tickets if the user lands on the root URL
  useEffect(() => {
    if (location.pathname === "/member") {
      navigate("tickets");
    }
  }, [location.pathname, navigate]);

  // Fetch Steam Account when user logs in or refreshTrigger changes
  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (loggedInUser && getMainJwtToken()) {
        setUserLoading(true);
        setLoading(true);
        try {
          const steamData = await getLinkedSteamAccount();
          const discordData = await getLinkedDiscordAccount();
          const minecraftData = await getLinkedMinecraftAccount();
          const epicData = await getLinkedEpicAccount(); // ✅ Fetch Epic

          const linked = [];
          if (discordData?.discordId) {
            setDiscordAccount(discordData);
            linked.push({ name: "Discord", ...discordData });
          } else {
            setDiscordAccount(null);
          }

          if (steamData?.steamId) {
            setSteamAccount(steamData);
            linked.push({ name: "Steam", ...steamData });
          } else {
            setSteamAccount(null);
          }

          if (minecraftData?.minecraftUuid) {
            setMinecraftAccount(minecraftData);
            linked.push({ name: "Minecraft", ...minecraftData });
          } else {
            setMinecraftAccount(null);
          }

          if (epicData?.eosId) {
            // ✅ Check if Epic is linked
            setEpicAccount(epicData);
            linked.push({ name: "Epic", ...epicData });
          } else {
            setEpicAccount(null);
          }

          setLinkedAccounts(linked);
        } catch (err) {
          console.error("Failed to load linked accounts.", err);
          setError("Failed to load linked accounts.");
        } finally {
          setLoading(false);
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };

    fetchLinkedAccounts();
  }, [loggedInUser, refreshTrigger]);

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
    } else if (platform === "Discord") {
      linkDiscordAccount(() => {
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platform === "Minecraft") {
      openMinecraftAuthWindow();
      setTimeout(() => setRefreshTrigger((prev) => !prev), 5000);
      setLoading(false);
    } else if (platform === "Epic") {
      // ✅ Open Epic Popup
      openEpicAuthWindow();
      setTimeout(() => setRefreshTrigger((prev) => !prev), 5000);
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
    } else if (platform === "Discord") {
      unlinkDiscordAccount(() => {
        setDiscordAccount(null);
        setLinkedAccounts((prev) =>
          prev.filter((acc) => acc.name !== "Discord")
        );
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platform === "Minecraft") {
      unlinkMinecraftAccount(() => {
        setMinecraftAccount(null);
        setLinkedAccounts((prev) =>
          prev.filter((acc) => acc.name !== "Minecraft")
        );
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platform === "Epic") {
      // ✅ Handle Epic Unlinking
      unlinkEpicAccount(() => {
        setEpicAccount(null);
        setLinkedAccounts((prev) => prev.filter((acc) => acc.name !== "Epic"));
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    }
  };

  return (
    <div className="member-layout mt-md-4 mt-2 pt-md-5 pt-0 px-0 col-md-9 col-12 mx-auto">
      <div className="member-container rounded-top mt-md-0 mt-5">
        <div className="member-header d-flex justify-content-between align-items-start">
          {/* LEFT SIDE - Profile Info */}
          <div className="profile-info col-md-5 col-12 d-md-flex justify-content-center h-100">
            {/* Profile Container: Image -> Name -> Points */}
            <div className="d-flex justify-content-md-end justify-content-center align-items-end img-name-points col-md-6 col-12 mb-md-0 mb-2">
              <div className="d-flex d-md-block col-12 col-md-8 ms-md-0 justify-content-center align-items-center">
                {/* Profile Image */}
                <div className="hexagon mb-1 mt-md-0 mt-2 col-12">
                  <img
                    src={
                      discordAccount?.discordImgUrl ||
                      steamAccount?.steamImgUrl ||
                      minecraftAccount?.MinecraftAvatarUrl ||
                      epicAccount?.avatarUrl ||
                      `https://picsum.photos/seed/${randomSeed}/100/100`
                    }
                    alt="Profile"
                    className="profile-img"
                  />
                </div>

                {/* Username */}
                <h3 className="text-white d-none d-md-block mb-0 member-name">
                  {userLoading
                    ? "Loading..."
                    : loggedInUser?.firstName || "Guest"}
                </h3>
                <div className="d-md-flex d-block col-6 col-md-12 justify-content-center ms-2 ms-md-0">
                  <div className="d-flex align-items-center">
                    <h3 className="text-white text-start d-md-none d-block mb-0 mt-4">
                      {userLoading
                        ? "Loading..."
                        : loggedInUser?.firstName || "Guest"}
                    </h3>
                    {/* Linked Accounts for Mobile */}
                    {linkedAccounts.length > 0 && (
                      <div className="d-md-none d-flex flex-row justify-content-start mt-3 ms-1">
                        {linkedAccounts.map((acc) => (
                          <button
                            key={acc.name}
                            className="btn p-0 m-1 border-0 bg-transparent"
                            onClick={() => handleUnlinkAccount(acc.name)}
                            disabled={loading}
                          >
                            <img
                              src={
                                availableAccounts.find(
                                  (a) => a.name === acc.name
                                )?.icon
                              }
                              alt={`${acc.name} Icon`}
                              style={{ width: "20px", height: "20px" }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <h6 className="text-start text-secondary d-md-none d-block">
                    {loggedInUser?.email || "Please log in to view your email."}
                  </h6>
                  <div className="d-flex align-items-center justify-content-between border border-secondary rounded-5 p-1 text-white fw-bold fs-6 col-md-9 col-12 mx-md-auto ms-0 position-relative mb-md-4 mb-1 mt-3 points-container">
                    <img src={zlgCoin} alt="" className="zlg-coin" />
                    <div className="text-container">
                      <p className="mb-0 points2">1455</p>
                    </div>
                    <Link
                      to="https://zlg.gg/aseshop"
                      className="text-secondary buy-points"
                    >
                      <img src={buyPoints} alt="" />
                    </Link>
                  </div>

                  {/* Add Accounts for Mobile */}
                  {availableAccounts.filter(
                    (acc) =>
                      !linkedAccounts.some((linked) => linked.name === acc.name)
                  ).length > 0 && (
                    <div className="d-md-none d-flex flex-row justify-content-start mt-1 border-secondary border rounded-3 col-6 mt-3">
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
                            className="btn p-0 m-1 border-0 bg-transparent"
                            onClick={() => handleLinkAccount(acc.name)}
                            disabled={loading}
                          >
                            <img
                              src={acc.icon}
                              alt={`${acc.name} Icon`}
                              style={{ width: "20px", height: "20px" }}
                            />
                          </button>
                        ))}
                      <i className="bi bi-plus my-auto ms-4 text-white"></i>
                    </div>
                  )}
                </div>
                {/* Points */}
              </div>
            </div>
            {/* Linked/Unlinked Accounts */}
            <div className="d-md-flex d-none flex-md-column flex-row ms-2 justify-content-start account-section mt-2 ms-md-4 ms-0 col-md-5 col-12 mx-auto">
              {/* Linked Accounts Section - Hidden on mobile if no linked accounts */}
              {linkedAccounts.length > 0 ? (
                <div className="linked-accounts col-md-12 col-7 mt-1 mt-md-0 order-1 order-md-2">
                  <div
                    className={`text-white text-start d-flex mb-1 align-items-center ${
                      availableAccounts.filter(
                        (acc) =>
                          !linkedAccounts.some(
                            (linked) => linked.name === acc.name
                          )
                      ).length === 0
                        ? "mt-4"
                        : ""
                    }`}
                  >
                    <i className="bi bi-link-45deg"></i>{" "}
                    <p className="p-0 m-0 linked-accounts">Linked Accounts</p>
                  </div>

                  {linkedAccounts.map((acc) => (
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
                          className="linked-icon-img"
                        />
                        <div>
                          <p className="mb-0 text-white text-start">
                            {acc.name === "Minecraft"
                              ? capitalizeFirstLetter(acc.minecraftUsername)
                              : acc.name === "Epic"
                              ? capitalizeFirstLetter(acc.epicName)
                              : acc.discordName
                              ? formatDiscordName(acc.discordName)
                              : acc.steamName
                              ? capitalizeFirstLetter(acc.steamName)
                              : capitalizeFirstLetter(acc.name)}
                          </p>
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
                  ))}
                </div>
              ) : (
                <div className="d-none d-md-block col-md-12 col-7 mt-1 mt-md-0 order-1 order-md-2">
                  <p className="text-white text-start">
                    Link your accounts for rewards!
                  </p>
                </div>
              )}

              <div
                className={`add-accounts mb-3 mt-md-0 justify-content-md-start ms-md-0 ${
                  linkedAccounts.length === 0
                    ? "col-9 mx-auto justify-content-center order-2 order-md-1"
                    : "col-4 col-md-6 order-2 order-md-1"
                } ${
                  availableAccounts.filter(
                    (acc) =>
                      !linkedAccounts.some((linked) => linked.name === acc.name)
                  ).length === 0
                    ? "d-none"
                    : ""
                }`}
              >
                {/* Hide "+ Add Accounts" on mobile */}
                <div className="text-white text-md-start text-center align-items-center mb-1 d-flex justify-content-center justify-content-md-start add-accounts">
                  <i className="bi bi-plus fs-6 my-0"></i> Add Accounts
                </div>

                <div className="d-flex gap-2 rounded px-2 py-1 available-accounts ms-auto mt-0 justify-content-start">
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
                        className="btn px-md-1 py-md-1 p-0 add-btn"
                        onClick={() => handleLinkAccount(acc.name)}
                        disabled={loading}
                      >
                        <img src={acc.icon} alt={`${acc.name} Icon`} />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Shop */}
          <div className="shop-popular col-7 d-none d-md-flex justify-content-center align-items-center mt-4">
            <div className="card p-1 border-0">
              <div className="card-body p-1">
                <img src={tierOne} alt="" />
                <p className="card-text mb-1 mt-3 fs-6">
                  <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
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
            <div className="card p-1 mx-3 card-back border-0">
              <div className="card-body p-1">
                <img src={tierTwo} alt="" />
                <p className="card-text mb-1 mt-3 fs-6">
                  <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
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
            <div className="card p-1 border-0">
              <div className="card-body p-1">
                <img src={tierThree} alt="" />
                <p className="card-text mb-1 mt-3 fs-6">
                  <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
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
        <nav className="d-flex justify-content-start member-nav pt-3">
          <div className="col-12 d-flex justify-content-center mt-0 member-links">
            <NavLink
              to="/member/stats"
              className={({ isActive }) =>
                `mx-4 text-white text-decoration-none d-flex align-items-center ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-bar-chart-fill me-1"></i>
              <p className="ps-2 m-0">Stats</p>
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `me-4 text-white text-decoration-none d-flex align-items-center ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-bag-plus-fill me-1"></i>
              <p className="ps-2 m-0">Shop</p>
            </NavLink>
            <NavLink
              to="/member/tickets"
              className={({ isActive }) =>
                `text-white me-4 text-decoration-none d-flex align-items-center ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-ticket-fill me-1"></i>
              <p className="ps-2 m-0">Tickets</p>
            </NavLink>
            <NavLink
              to="/member/notifications"
              className={({ isActive }) =>
                `text-white me-4 text-decoration-none d-flex align-items-center ${
                  isActive ? "border-bottom border-danger border-5" : ""
                }`
              }
            >
              <i className="bi bi-envelope-fill me-1"></i>
              <p className="ps-2 m-0">Notifications</p>
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
