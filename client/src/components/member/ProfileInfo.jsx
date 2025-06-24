import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMainJwtToken } from "../../managers/steamAuthManager";
import { getLinkedDiscordAccount } from "../../managers/discordAuthManager";
import { getProxiedDiscordImgUrl } from "../../managers/discordAuthManager";
import { getUserMembership } from "../../managers/userProfileManager";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import {
  getMembershipTier,
  getTierGradient,
  getTierBadgeImage,
} from "../../utils/subscriptionUtils";
import zlgCoin from "../../assets/member/zlgCoin.webp";
import buyPoints from "../../assets/member/buyPoints.webp";

export default function ProfileInfo({ loggedInUser }) {
  const [discordAccount, setDiscordAccount] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [membership, setMembership] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const tier = getMembershipTier(membership);
  const tierGradient = getTierGradient(tier);
  const tierBadge = getTierBadgeImage(tier);

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (loggedInUser && getMainJwtToken()) {
        setUserLoading(true);
        try {
          const [discordData] = await Promise.all([getLinkedDiscordAccount()]);
          if (discordData?.discordId) setDiscordAccount(discordData);
          else setDiscordAccount(null);
        } catch (err) {
          console.error("❌ Failed to load linked accounts", err);
        } finally {
          setUserLoading(false);
        }
        try {
          const membership = await getUserMembership();
          if (membership?.points != null) {
            setUserPoints(membership.points);
          }
          setMembership(membership);
        } catch (err) {
          console.error("❌ Failed to fetch membership", err);
        }
      }
    };
    fetchLinkedAccounts();
  }, [loggedInUser]);

  return (
    <div className="profile-info d-md-flex justify-content-center col-12 ps-md-0 ps-2">
      <div className="d-flex justify-content-md-end justify-content-center align-items-end img-name-points col-12 mb-md-0 mb-2">
        <div className="d-flex flex-row align-items-center justify-content-start col-12 ps-md-2 ps-0 gap-1 h-100">
          <div className="hexagon" style={{ background: tierGradient }}>
            <img
              src={getProxiedDiscordImgUrl(discordAccount?.discordImgUrl)}
              alt="Profile"
              className="profile-img"
              loading="lazy"
            />
          </div>
          <div className="py-4 h-100 px-2 d-none d-md-block">
            <div className="border-start border-secondary h-100"></div>
          </div>
          <div className="info-container ps-md-2 ps-0">
            {/* Discord Name */}
            <h3 className="text-white d-flex mb-0 member-name align-items-center">
              <img
                src={tierBadge}
                alt=""
                className="subscription-icon me-2"
                loading="lazy"
                aria-hidden="true"
                style={{ width: "25px", height: "25px" }}
              />
              <span
                className={
                  (discordAccount?.discordName
                    ? formatDiscordName(discordAccount.discordName)
                    : loggedInUser?.firstName || "Guest"
                  ).length > 12
                    ? "smaller-username"
                    : ""
                }
              >
                {userLoading
                  ? "Loading..."
                  : discordAccount?.discordName
                  ? capitalizeFirstLetter(
                      formatDiscordName(discordAccount.discordName)
                    )
                  : loggedInUser?.firstName || "Guest"}
              </span>
            </h3>

            {/* Email */}
            <h6 className="text-start text-secondary mt-1 mb-0">
              {loggedInUser?.email || "Please log in to view your email."}
            </h6>

            {/* Points */}
            <div className="points d-flex align-items-center justify-content-start mt-2 pt-1 ps-2">
              <div className="d-flex justify-content-start align-items-center text-white fw-bold fs-6 col-8 position-relative points-container h-100">
                <img
                  src={zlgCoin}
                  alt=""
                  className="zlg-coin"
                  loading="lazy"
                  aria-hidden="true"
                />
                <div className="text-container border border-secondary p-0 rounded-end-5">
                  <span>{formatNumberWithCommas(userPoints)}</span>
                </div>
                <Link to="/shop" className="text-secondary buy-points">
                  <img
                    src={buyPoints}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
