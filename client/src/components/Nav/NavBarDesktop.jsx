import { Link, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";

export default function NavBarDesktop({
  loggedInUser,
  steamAccount,
  discordAccount,
  unreadNotifications,
  cartCount,
  userPoints,
  handleLogout,
  randomSeed,
  showDropdown,
  setShowDropdown,
  dropdownRef,
}) {
  const navigate = useNavigate();

  return (
    <div className="d-none d-lg-flex align-items-center justify-content-end position-relative col-2">
      <Link
        to={`/shop`}
        className="mb-1"
        data-bs-toggle="tooltip"
        title="Shop"
        data-bs-placement="bottom"
      >
        <img src="/images/addPoints.png" alt="" className="me-4 addPoints" />
      </Link>
      <Link
        to={`/discord`}
        data-bs-toggle="tooltip"
        title="Discord"
        data-bs-placement="bottom"
      >
        <i className="fa-brands fa-discord text-white fs-3 me-4"></i>
      </Link>
      <Link
        to="/#ServerListDisplay"
        data-bs-toggle="tooltip"
        title="Go to Servers"
        data-bs-placement="bottom"
        className="me-3"
      >
        <i className="fa-solid fa-gamepad text-white fs-3"></i>
      </Link>
      {!loggedInUser ? (
        <div
          className="p-0 d-flex justify-content-center align-items-center login-btn"
          onClick={() => navigate("/login")}
        >
          <p className="my-0 me-3 text-white">Login</p>
          <i className="bi bi-person-circle fs-2 text-white"></i>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center col-10 ms-2">
          <Link
            to="/member/notifications"
            className="nav-link ps-2 pe-2 position-relative border-start border-secondary"
          >
            <i className="bi bi-bell-fill text-white fs-6 me-2"></i>
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
            <i className="fa-solid fa-cart-shopping text-white fs-6 me-2"></i>
            {cartCount > 0 && (
              <span className="cart-badge rounded-circle text-white bg-danger">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="m-0 text-center col-8 my-2 ps-3">
            <h5 className="text-white text-center mb-1 navbar-first-name">
              <span
                className={
                  (discordAccount?.discordName
                    ? formatDiscordName(discordAccount.discordName)
                    : loggedInUser?.firstName || "Guest"
                  ).length > 12
                    ? "small-username"
                    : ""
                }
              >
                {discordAccount?.discordName
                  ? capitalizeFirstLetter(
                      formatDiscordName(discordAccount.discordName)
                    )
                  : loggedInUser?.firstName || "Guest"}
              </span>
            </h5>

            <div className="d-flex align-items-center justify-content-between border border-secondary rounded-5 p-0 text-white col-md-10 col-12 mx-md-auto ms-0 position-relative">
              <img src="/images/zlgCoin.png" alt="" className="zlg-coin3" />
              <div className="text-container points-container">
                <p className="mb-0">{formatNumberWithCommas(userPoints)}</p>
              </div>
              <Link to="/shop" className="text-secondary buy-points3">
                <img src="/images/buyPoints.png" alt="" />
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
          />

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="dropdown-menu show profile-menu text-white py-3 px-2 shadow fade-in2"
            >
              <div className="d-flex align-items-center mb-3 ps-2">
                <img
                  src={
                    discordAccount?.discordImgUrl ||
                    steamAccount?.steamImgUrl ||
                    `https://picsum.photos/seed/${randomSeed}/40/40`
                  }
                  alt="Profile"
                  className="rounded-circle me-2"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <span className="fw-bold fs-5">
                    {discordAccount?.discordName
                      ? capitalizeFirstLetter(
                          formatDiscordName(discordAccount.discordName)
                        )
                      : loggedInUser?.firstName || "Guest"}
                  </span>
                  <span className="d-block fs-6">{loggedInUser.email}</span>
                </div>
              </div>

              <hr className="my-3" />

              <button
                className="dropdown-item text-white d-flex justify-content-start align-items-center"
                onClick={() => navigate("/member")}
              >
                <i className="bi bi-person-circle me-3 fs-2"></i> My Profile
              </button>

              <button
                className="dropdown-item text-white d-flex justify-content-start align-items-center"
                onClick={() => navigate("/member/accountsettings")}
              >
                <i className="bi bi-gear me-3 fs-2"></i> Settings & Privacy
              </button>

              <button
                className="dropdown-item text-white d-flex justify-content-start align-items-center"
                onClick={() => window.open("/discord", "_blank")}
              >
                <i className="bi bi-discord me-3 fs-2 text-white"></i> Zombie
                Lynx Discord
              </button>
              <button
                className="dropdown-item text-white d-flex justify-content-start align-items-center"
                onClick={() => navigate("/member/admin/users")}
              >
                <i className="bi bi-people-fill me-3 fs-2 text-white"></i> Admin
              </button>

              <button
                className="dropdown-item text-white d-flex justify-content-start align-items-center"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right px-1 me-2 fs-2"></i> Log Out
              </button>
              <div className="d-flex align-items-center justify-content-around mt-4 mb-0">
                <Link
                  to="/privacy-policy"
                  className="text-decoration-none text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/zlg-rules"
                  className="text-decoration-none text-white"
                >
                  Rules
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
