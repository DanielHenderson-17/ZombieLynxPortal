import { Route, Routes, useLocation } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Home from "../components/home/Home";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Register from "./auth/Register";
import Verify from "./auth/Verify";
import VerifyEmail from "./auth/VerifyEmail";
import Member from "../components/member/Member";
import Tickets from "../components/tickets/Tickets";
import Stats from "../components/stats/Stats";
import Shop from "../components/shop/Shop";
import Cart from "../components/shop/Cart";
import Notifications from "../components/notifications/Notifications";
import Votes from "../components/vote/Votes";
import AdminPanel from "../components/admin/AdminPanel";
import LoginSuccess from "./auth/LoginSuccess";
import NavBar from "../components/Nav/NavBar";
import PrivacyPolicy from "../components/legal/PrivacyPolicy";
import Rules from "../components/legal/Rules";
import DiscordRedirect from "../components/discord/DiscordRedirect";
import AccountSettings from "./settings/AccountSettings";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();

  // Routes where the NavBar should not be displayed
  const hideDesktopNavBar =
    location.pathname.startsWith("/member") ||
    [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/discord",
    ].includes(location.pathname);

  return (
    <>
      {/* Conditionally display the NavBar */}
      <NavBar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        hideDesktopNavBar={hideDesktopNavBar}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="discord" element={<DiscordRedirect />} />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="login-success"
          element={<LoginSuccess setLoggedInUser={setLoggedInUser} />}
        />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="zlg-rules" element={<Rules />} />
        <Route path="verify" element={<Verify />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="member/*"
          element={
            <AuthorizedRoute
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            >
              <Member
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
              />
            </AuthorizedRoute>
          }
        >
          {/* Nested routes under /member */}
          <Route
            path="tickets/*"
            element={<Tickets loggedInUser={loggedInUser} />}
          />
          <Route
            path="stats/*"
            element={<Stats loggedInUser={loggedInUser} />}
          />

          <Route
            path="notifications/*"
            element={<Notifications loggedInUser={loggedInUser} />}
          />
          <Route
            path="vote/*"
            element={<Votes loggedInUser={loggedInUser} />}
          />

          <Route path="settings/*" element={<AccountSettings />} />
          <Route
            path="admin/*"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                {loggedInUser?.role === "Admin" ? (
                  <AdminPanel />
                ) : (
                  <p className="text-danger m-3">Access denied.</p>
                )}
              </AuthorizedRoute>
            }
          />

          <Route
            index
            element={<p>Select a module from the navigation above.</p>}
          />
        </Route>
        <Route
          path="shop"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Shop loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route
          path="shop/cart"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Cart />
            </AuthorizedRoute>
          }
        />

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<p>Whoops, nothing here...</p>} />
      </Routes>
    </>
  );
}
