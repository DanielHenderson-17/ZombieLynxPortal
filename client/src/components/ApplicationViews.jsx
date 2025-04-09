import { Route, Routes, useLocation } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Home from "../components/home/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Member from "../components/member/Member";
import Tickets from "../components/tickets/Tickets";
import Stats from "../components/stats/Stats";
import Shop from "../components/shop/Shop";
import Notifications from "../components/notifications/Notifications";
import CreateNotification from "../components/notifications/CreateNotification";
import LoginSuccess from "./auth/LoginSuccess";
import NavBar from "./NavBar";
import PrivacyPolicy from "../components/legal/PrivacyPolicy";
import Rules from "../components/legal/Rules";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();

  // Routes where the NavBar should not be displayed
  const hideNavBarRoutes = ["/login", "/register"];

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
          <Route
            index
            element={<p>Select a module from the navigation above.</p>}
          />
        </Route>
        <Route
          path="shop"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Shop />
            </AuthorizedRoute>
          }
        />

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<p>Whoops, nothing here...</p>} />
      </Routes>
    </>
  );
}
