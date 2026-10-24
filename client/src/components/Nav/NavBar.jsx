import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaDiscord,
  FaGamepad,
  FaShoppingBag,
  FaShoppingCart,
  FaUserPlus,
} from "react-icons/fa";
import zlgCoin from "../../assets/nav/zlgCoin.webp";
import buyPoints from "../../assets/nav/buyPoints.webp";
import { useCart } from "../../contexts/CartContext";
import { usePointsRefresher } from "../../hooks/usePointsRefresher";
import { logout } from "../../managers/authManager";
import {
  getUserMembership,
  getUserProfiles,
} from "../../managers/userProfileManager";
import { getUserNotifications } from "../../managers/notificationManager";
import {
  getLinkedDiscordAccount,
  getProxiedDiscordImgUrl,
} from "../../managers/discordAuthManager";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import { formatDiscordName } from "../../utils/formatDiscordName";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import zlgLogo from "../../assets/nav/zlg-logo.webp";

export default function NavBar({
  loggedInUser,
  setLoggedInUser,
  hideDesktopNavBar,
}) {
  const [userPoints, setUserPoints] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [discordAccount, setDiscordAccount] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const profileMenuRef = useRef(null);

  usePointsRefresher(setUserPoints, loggedInUser);

  const cartCount =
    (cartItems.subscription ? 1 : 0) +
    cartItems.single.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch basic user info for nav badges
  useEffect(() => {
    if (!loggedInUser) return;

    getUserProfiles()
      .then((profile) => {
        if (!profile || typeof profile !== "object") return;

        if (
          profile.email === loggedInUser.email ||
          profile.userId === loggedInUser.id ||
          profile.id === loggedInUser.id
        ) {
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

  // Fetch notifications and Discord account (for display name)
  useEffect(() => {
    if (!loggedInUser) return;

    const fetchData = async () => {
      try {
        const [notifications, discord] = await Promise.all([
          getUserNotifications(),
          getLinkedDiscordAccount(),
        ]);
        const unreadCount = (notifications || []).filter(
          (n) => !n.isRead
        ).length;
        setUnreadNotifications(unreadCount);
        setDiscordAccount(discord ?? null);
      } catch (error) {
        console.error("Failed to fetch navbar data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [loggedInUser]);

  // Scroll to hash on location change (preserve existing behavior)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
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

  const handleNavClick = (to) => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate(to);
  };

  const avatarSrc =
    discordAccount?.discordImgUrl && loggedInUser
      ? getProxiedDiscordImgUrl(discordAccount.discordImgUrl)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          loggedInUser?.firstName || "User"
        )}`;

  const showNav = !hideDesktopNavBar;

  if (!showNav) return null;

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-40 min-w-full border-b border-[var(--color-secondary-selected)] bg-[var(--color-primary)]/95 backdrop-blur"
    >
      <div className="flex w-full items-center justify-between px-0 py-2">
        {/* Left: Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("/#home")}
          className="btn-no-border flex items-center gap-2"
          aria-label="Go to home"
        >
          <img
            src={zlgLogo}
            alt="Zombie Lynx Gaming"
            className="h-10 w-auto max-w-[220px] object-contain"
            loading="lazy"
          />
        </button>

        {/* Right: main actions (pushed to far right) */}
        <div className="ml-auto flex items-center gap-7 text-[0.95rem] font-medium">
          <button
            type="button"
            onClick={() => handleNavClick("/shop")}
            className="nav-link-btn inline-flex items-center gap-2 text-white hover:text-[var(--color-secondary)]"
          >
            <span className="nav-link-btn-text">Shop</span>
            <FaShoppingBag size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("/discord")}
            className="nav-link-btn inline-flex items-center gap-2 text-white hover:text-[var(--color-secondary)]"
          >
            <span className="nav-link-btn-text">Discord</span>
            <FaDiscord size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("/#ServerListDisplay")}
            className="nav-link-btn inline-flex items-center gap-2 text-white hover:text-[var(--color-secondary)]"
          >
            <span className="nav-link-btn-text">Servers</span>
            <FaGamepad size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("/shop/cart")}
            className="nav-link-btn relative inline-flex items-center gap-1 text-white hover:text-[var(--color-secondary)]"
          >
            <span className="nav-link-btn-text">Cart</span>
            <span className="relative inline-flex items-center justify-center">
              <FaShoppingCart size={18} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 inline-flex h-4 min-w-[1rem] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-secondary)] px-1 text-[0.6rem] font-semibold">
                  {cartCount}
                </span>
              )}
            </span>
          </button>

          {!loggedInUser ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNavClick("/login")}
                className="btn-no-border inline-flex items-center gap-2 text-white hover:text-[var(--color-secondary)]"
              >
                <span>Sign in</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("/login")}
                className="btn-signin-circle inline-flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center border-2 bg-transparent text-white hover:text-[var(--color-secondary)]"
                aria-label="Sign in"
              >
                <FaUserPlus size={20} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavClick("/member/notifications")}
                className="relative inline-flex items-center gap-1 text-white hover:text-[var(--color-secondary)]"
              >
                <span>Alerts</span>
                <span className="relative inline-flex items-center justify-center">
                  <FaBell size={18} aria-hidden="true" />
                  {unreadNotifications > 0 && (
                    <span className="absolute right-0 top-0 inline-flex h-4 min-w-[1rem] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-secondary)] px-1 text-[0.6rem] font-semibold">
                      {unreadNotifications}
                    </span>
                  )}
                </span>
              </button>

              <div className="flex flex-col items-center gap-1 overflow-visible text-white">
                <span className="text-xl font-semibold">
                  {discordAccount?.discordName
                    ? capitalizeFirstLetter(
                        formatDiscordName(discordAccount.discordName)
                      )
                    : loggedInUser?.firstName ?? "Guest"}
                </span>
                <div className="relative inline-block overflow-visible">
                  <div
                    className="rounded-full px-4 py-0.5 text-[0.75rem] text-[var(--color-text)]"
                    style={{
                      border: "1px solid var(--color-border-primary)",
                    }}
                  >
                    <span className="font-semibold tabular-nums">
                      {formatNumberWithCommas(userPoints)}
                    </span>
                  </div>
                  <span
                    className="absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center"
                    aria-hidden
                    style={{ left: "-14px" }}
                  >
                    <img
                      src={zlgCoin}
                      alt="ZLG coin"
                      className="max-h-7 max-w-7 object-contain"
                      style={{ maxWidth: "1.75rem", maxHeight: "1.75rem" }}
                      loading="lazy"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavClick("/shop")}
                    className="btn-no-border absolute top-1/2 z-10 flex h-7 w-7 -translate-y-[55%] items-center justify-center bg-transparent p-0"
                    aria-label="Buy points"
                    style={{ right: "-14px" }}
                  >
                    <img
                      src={buyPoints}
                      alt="Buy points"
                        className="max-h-7 max-w-7 object-contain"
                        style={{ maxWidth: "1.75rem", maxHeight: "1.75rem" }}
                      loading="lazy"
                    />
                  </button>
                </div>
              </div>

              {/* Profile avatar + dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileMenuOpen((isOpen) => !isOpen)
                  }
                  className="btn-no-border inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-card)] p-0 ring ring-[var(--color-secondary-selected)]"
                  aria-label="Open profile menu"
                  style={{ width: "44px", height: "44px" }}
                >
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="object-cover"
                    style={{ width: "40px", height: "40px" }}
                    loading="lazy"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[115%] w-72 rounded-2xl border border-[var(--color-secondary-selected)] bg-[var(--color-card)] p-3 text-sm shadow-xl">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--color-primary)]">
                        <img
                          src={avatarSrc}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold">
                          {discordAccount?.discordName
                            ? capitalizeFirstLetter(
                                formatDiscordName(discordAccount.discordName)
                              )
                            : loggedInUser?.firstName || "Guest"}
                        </div>
                        <div className="truncate text-xs text-[var(--color-text-muted)]">
                          {loggedInUser?.email}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 space-y-1">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[0.9rem] hover:bg-[var(--color-secondary-selected)]"
                        onClick={() => handleNavClick("/member")}
                      >
                        <span>My Profile</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[0.9rem] hover:bg-[var(--color-secondary-selected)]"
                        onClick={() =>
                          handleNavClick("/member/settings/general")
                        }
                      >
                        <span>Settings &amp; Privacy</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[0.9rem] hover:bg-[var(--color-secondary-selected)]"
                        onClick={() => window.open("/discord", "_blank")}
                      >
                        <span>Zombie Lynx Discord</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[0.9rem] hover:bg-[var(--color-secondary-selected)]"
                        onClick={() => handleNavClick("/member/admin/users")}
                      >
                        <span>Admin</span>
                      </button>
                      <button
                        type="button"
                        className="mt-1 flex w-full items-center justify-center rounded-full bg-[var(--color-secondary)] px-3 py-1.5 text-[0.9rem] font-medium text-white hover:bg-[var(--color-secondary-selected)]"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[0.75rem] text-[var(--color-text-muted)]">
                      <button
                        type="button"
                        className="hover:text-[var(--color-text)]"
                        onClick={() => handleNavClick("/privacy-policy")}
                      >
                        Privacy Policy
                      </button>
                      <button
                        type="button"
                        className="hover:text-[var(--color-text)]"
                        onClick={() => handleNavClick("/zlg-rules")}
                      >
                        Rules
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-card)] text-white md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <span className="block h-0.5 w-4 bg-current" />
        </button>
      </div>

      {/* Mobile menu sheet */}
      {isMenuOpen && (
        <div className="border-t border-[var(--color-secondary-selected)] bg-[var(--color-primary)]/98 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm text-white">
            <button
              type="button"
              onClick={() => handleNavClick("/shop")}
              className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3"
            >
              <span>Shop</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("/discord")}
              className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3"
            >
              <span>Discord</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("/#ServerListDisplay")}
              className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3"
            >
              <span>Servers</span>
            </button>

            {cartCount > 0 && (
              <button
                type="button"
                onClick={() => handleNavClick("/shop/cart")}
                className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3"
              >
                <span>Cart</span>
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-secondary)] px-1 text-xs font-semibold">
                  {cartCount}
                </span>
              </button>
            )}

            {!loggedInUser ? (
              <button
                type="button"
                onClick={() => handleNavClick("/login")}
                className="mt-1 flex h-9 items-center justify-center rounded-md bg-[var(--color-secondary)] px-3 font-medium"
              >
                Login
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick("/member/notifications")}
                  className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3"
                >
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-secondary)] px-1 text-xs font-semibold">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <div className="flex h-9 items-center justify-between rounded-md bg-[var(--color-card)] px-3">
                  <span>Points</span>
                  <span className="font-semibold">
                    {formatNumberWithCommas(userPoints)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex h-9 items-center justify-center rounded-md bg-[var(--color-secondary)] px-3 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

