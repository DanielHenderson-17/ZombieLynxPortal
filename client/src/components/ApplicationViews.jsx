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
import CreateNotification from "../components/notifications/CreateNotification";
import AccountSettings from "../components/member/AccountSettings";
import AdminPanel from "../components/admin/AdminPanel";
import LoginSuccess from "./auth/LoginSuccess";
import NavBar from "../components/Nav/NavBar";
import PrivacyPolicy from "../components/legal/PrivacyPolicy";
import Rules from "../components/legal/Rules";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();

  // Routes where the NavBar should not be displayed
  const hideNavBarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  return (
    <>
      {/* Conditionally display the NavBar */}
      {!hideNavBarRoutes.includes(location.pathname) && (
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
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
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Member loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        >
          {/* Nested routes under /member */}
          <Route
            path="tickets/*"
            element={<Tickets loggedInUser={loggedInUser} />}
          />
          <Route path="stats" element={<Stats />} />
          {/* <Route path="shop" element={<Shop />} /> */}
          <Route
            path="notifications"
            element={<Notifications loggedInUser={loggedInUser} />}
          />
          <Route
            path="notifications/create"
            element={<CreateNotification loggedInUser={loggedInUser} />}
          />
          <Route path="accountsettings" element={<AccountSettings />} />
          <Route
            path="admin/users"
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
