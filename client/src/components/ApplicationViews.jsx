import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Member from "../components/member/Member";
import Tickets from "../components/tickets/Tickets";
import Stats from "../components/stats/Stats";
import Shop from "../components/shop/Shop";
import LoginSuccess from "./auth/LoginSuccess";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      {/* Member Layout for logged-in users */}
      <Route
        path="/"
        element={
          <AuthorizedRoute loggedInUser={loggedInUser}>
            <Member loggedInUser={loggedInUser} />
          </AuthorizedRoute>
        }
      >
        {/* Nested routes rendered within Member */}
        <Route
          path="tickets/*"
          element={<Tickets loggedInUser={loggedInUser} />}
        />
        <Route path="stats" element={<Stats />} />
        <Route path="shop" element={<Shop />} />
        <Route
          index
          element={<p>Select a module from the navigation above.</p>}
        />
      </Route>

      {/* Login and Register for unauthenticated users */}
      <Route
        path="login"
        element={<Login setLoggedInUser={setLoggedInUser} />}
      />
      <Route
        path="/login-success"
        element={<LoginSuccess setLoggedInUser={setLoggedInUser} />}
      />

      <Route
        path="register"
        element={<Register setLoggedInUser={setLoggedInUser} />}
      />

      {/* Catch-all for invalid routes */}
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
