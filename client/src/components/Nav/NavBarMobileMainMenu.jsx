import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
import { getUserMembership } from "../../managers/userProfileManager";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import {
  getMembershipTier,
  getTierGradient,
} from "../../utils/subscriptionUtils";

export default function NavBarMobileMainMenu({
  onClose,
  onLogout,
  loggedInUser,
}) {
  const navigate = useNavigate();
  const [discordAccount, setDiscordAccount] = useState(null);
  const [membership, setMembership] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discordData = await getLinkedDiscordAccount();
        const membershipData = await getUserMembership();

        setDiscordAccount(discordData);
        setMembership(membershipData);
        if (membershipData?.points != null) {
          setUserPoints(membershipData.points);
        }
      } catch (err) {
        console.error("Error loading main menu user data:", err);
      }
    };

    if (loggedInUser) fetchData();
  }, [loggedInUser]);

  const tier = getMembershipTier(membership || {});
  const tierGradient = getTierGradient(tier);
  const tierIcons = {
    Gold: "/images/gold.png",
    Diamond: "/images/diamond.png",
    Vibranium: "/images/vibranium.png",
    Standard: "/images/standard.png",
  };

  const avatarSrc =
    discordAccount?.discordImgUrl ||
    `https://ui-avatars.com/api/?name=${loggedInUser?.firstName || "User"}`;

  const displayName =
    discordAccount?.discordName || loggedInUser?.firstName || "Guest";

  return (
    <div className="navbar-mobile-main-menu position-fixed top-0 start-0 w-100 h-100 bg-dark text-white d-flex flex-column p-4 overflow-auto">
      <button
        className="btn-close btn-close-white ms-auto"
        onClick={onClose}
        aria-label="Close"
      ></button>

      {loggedInUser && (
        <div className="text-center my-3">
          <div
            className="hexagon mx-auto mb-2"
            style={{
              background: tierGradient,
              width: "110px",
              height: "110px",
            }}
          >
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="profile-img"
              style={{ width: "104px", height: "104px" }}
            />
          </div>

          <div className="fs-4 d-flex justify-content-center align-items-center gap-2">
            <img
              src={tierIcons[tier]}
              alt={`${tier} Tier`}
              style={{ width: "26px", height: "26px" }}
            />
            {capitalizeFirstLetter(formatDiscordName(displayName))}
          </div>

          <div className="text-secondary small">
            {loggedInUser?.email || "Unknown email"}
          </div>

          <div className="mt-1 d-flex justify-content-center align-items-center gap-2">
            <img
              src="/images/zlgCoin.png"
              alt="ZLG Coin"
              style={{ width: 25 }}
            />
            <strong className="fs-5">
              {formatNumberWithCommas(userPoints)}
            </strong>
          </div>

          <hr className="bg-secondary mt-3 mb-1" />
        </div>
      )}

      <nav className="d-flex flex-column gap-3">
        <button
          className="text-white text-center bg-dark"
          onClick={() => {
            navigate("/member/tickets");
            onClose();
          }}
        >
          <i className="bi bi-person-circle me-2"></i>My Profile
        </button>
        <button
          className="text-white text-center bg-dark"
          onClick={() => {
            navigate("/shop");
            onClose();
          }}
        >
          <i className="bi bi-shop-window me-2"></i>Shop
        </button>
        <button
          className="text-white text-center bg-dark"
          onClick={() => {
            navigate("/shop/cart");
            onClose();
          }}
        >
          <i className="bi bi-cart-fill me-2"></i>Cart
        </button>
        {loggedInUser?.role === "Admin" && (
          <button
            className="text-white text-center bg-dark"
            onClick={() => {
              navigate("/member/admin/users");
              onClose();
            }}
          >
            <i className="bi bi-shield-lock-fill me-2"></i>Admin
          </button>
        )}
        <button
          className="text-white text-center bg-dark"
          onClick={() => {
            window.open("/discord", "_blank");
            onClose();
          }}
        >
          <i className="bi bi-discord me-2"></i>Zombie Lynx Discord
        </button>
        <hr className="bg-secondary my-2" />
        <button className="btn btn-danger mt-2" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>Log Out
        </button>
      </nav>
    </div>
  );
}
