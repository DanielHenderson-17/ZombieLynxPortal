import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { servicesOffline } from "../config/siteMode";
import Home from "./home/Home";
import NavBar from "./Nav/NavBar";
import ServiceOfflineNotice from "./auth/ServiceOfflineNotice";

const OnlineApplicationViews = lazy(() => import("./OnlineApplicationViews"));
const offlineAccountPaths = new Set([
  "/login", "/register", "/forgot-password", "/reset-password",
  "/verify", "/verify-email", "/login-success",
]);

export default function ApplicationViews(props) {
  const location = useLocation();

  if (!servicesOffline) {
    return (
      <Suspense fallback={<p role="status">Loading portal...</p>}>
        <OnlineApplicationViews {...props} />
      </Suspense>
    );
  }

  const pathname = location.pathname.replace(/\/+$/, "").toLowerCase();

  return (
    <>
      <NavBar
        loggedInUser={null}
        hideDesktopNavBar={false}
      />
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
      {offlineAccountPaths.has(pathname) && <ServiceOfflineNotice />}
    </>
  );
}

