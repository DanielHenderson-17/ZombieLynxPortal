import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
import { getUserMembership } from "../../managers/userProfileManager";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDiscordName } from "../../utils/formatDiscordName";
import {
  getMembershipTier,
  getTierGradient,
} from "../../utils/subscriptionUtils";
import zlgCoin from "../../assets/images/zlgCoin.png";
import buyPoints from "../../assets/images/buyPoints.png";

export default function NavBarMobile({
  loggedInUser,
  steamAccount,
  randomSeed,
  open,
  setOpen,
  handleLogout,
}) {
  const navigate = useNavigate();
  const [discordAccount, setDiscordAccount] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [membership, setMembership] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const tier = getMembershipTier(membership);
  const tierGradient = getTierGradient(tier);

  const avatarSrc =
    discordAccount?.discordImgUrl ||
    steamAccount?.steamImgUrl ||
    `https://picsum.photos/seed/${randomSeed}/150/150`;

  const displayName =
    discordAccount?.discordName || loggedInUser?.firstName || "Guest";

  useEffect(() => {
    const fetchData = async () => {
      setUserLoading(true);
      try {
        const discordData = await getLinkedDiscordAccount();
        setDiscordAccount(discordData);
        const membershipData = await getUserMembership();
        if (membershipData?.points != null) {
          setUserPoints(membershipData.points);
        }
        setMembership(membershipData);
      } catch (err) {
        console.error("❌ Error loading profile data:", err);
      } finally {
        setUserLoading(false);
      }
    };

    if (loggedInUser) {
      fetchData();
    }
  }, [loggedInUser]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      setOpen(false);
    }, 300);
  };

  return (
    <>
      {/* Hamburger Button */}
      <div className="d-flex d-lg-none align-items-center">
        <button
          className="btn btn-dark navbar-toggler border-0 pe-0 ms-auto"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon fs-6"></span>
        </button>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`mobile-slide-menu position-fixed top-0 end-0 vh-100 vw-100 bg-dark text-white overflow-auto ${
          open && !isAnimatingOut ? "show" : ""
        } ${isAnimatingOut ? "hide" : ""}`}
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex justify-content-end p-4">
          <button
            className="btn btn-close btn-close-white"
            onClick={handleClose}
          ></button>
        </div>

        <div className="text-center">
          <div
            className="hexagon mx-auto mb-1"
            style={{
              background: tierGradient,
              width: "160px",
              height: "160px",
            }}
          >
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="profile-img"
              style={{ width: "160px", height: "160px" }}
            />
          </div>

          <div className="mt-0 fs-1 d-flex justify-content-center align-items-center">
            <img
              src={`/public/${tier.toLowerCase()}.png`}
              alt={`${tier} Subscription`}
              className="subscription-icon me-2"
              style={{ width: "30px", height: "30px" }}
            />
            <span>
              {userLoading
                ? "Loading..."
                : capitalizeFirstLetter(formatDiscordName(displayName))}
            </span>
          </div>

          <h6 className="text-secondary my-2 fs-6">
            {loggedInUser?.email || "Please log in to view your email."}
          </h6>

          {/* Points Display */}
          <div className="points d-flex align-items-center justify-content-start mb-5 pt-1 ps-2 mx-auto">
            <div className="d-flex justify-content-start align-items-center text-white fw-bold fs-6 col-4 position-relative points-container h-100 mx-auto">
              <img src={zlgCoin} alt="" className="zlg-coin" />
              <div className="text-container border border-secondary p-0 rounded-end-5">
                <span>{userPoints}</span>
              </div>
              <Link to="/shop" className="text-secondary buy-points">
                <img src={buyPoints} alt="" />
              </Link>
            </div>
          </div>
          <hr className="col-8 mx-auto mb-4" />

          <div className="d-grid gap-4 px-5 pt-1">
            <button
              className="btn btn-link text-white fs-4 text-decoration-none"
              onClick={() => {
                handleClose();
                navigate("/member");
              }}
            >
              My Profile
            </button>

            <button
              className="btn btn-link text-white fs-4 text-decoration-none"
              onClick={() => {
                handleClose();
                navigate("/shop");
              }}
            >
              Shop
            </button>

            <button
              className="btn btn-link text-white fs-4 text-decoration-none"
              onClick={() => {
                handleClose();
                navigate("/member/notifications");
              }}
            >
              Notifications
            </button>

            <button
              className="btn btn-link text-white fs-4 text-decoration-none"
              onClick={() => {
                handleClose();
                navigate("/shop/cart");
              }}
            >
              Cart
            </button>

            <button
              className="btn btn-link text-white fs-4 text-decoration-none"
              onClick={() => {
                handleClose();
                window.open("https://www.zlg.gg/discord", "_blank");
              }}
            >
              Discord
            </button>

            <button
              className="btn btn-link text-danger fs-4 text-decoration-none"
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
