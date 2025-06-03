import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPackages, getPromoStatus } from "../../managers/tebexManager";
import { getToken } from "../../managers/authManager";
import { useCart } from "../../contexts/CartContext";
import Subscriptions from "./Subscriptions";
import PromoCard from "./PromoCard";
import Points from "./Points";
import ShopFilterSidebar from "./ShopFilterSidebar";
import "./Shop.css";

import { PROMO_PACKAGE_ID } from "../../utils/promoLockUtils";

export default function Shop({ loggedInUser }) {
  const [allPackages, setAllPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [promoReceivedDate, setPromoReceivedDate] = useState(null);
  const { cartItems, addItem, updateQuantity, removeItem } = useCart();
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getPackages()
      .then((res) => {
        if (res?.data) setAllPackages(res.data);
      })
      .catch((err) => console.error("Failed to load Tebex packages:", err));
  }, []);

  useEffect(() => {
    if (!loggedInUser) return;
    const token = getToken();
    getPromoStatus(token)
      .then((res) => setPromoReceivedDate(res.promoReceivedDate))
      .catch((err) => console.error("Failed to fetch promo status:", err));
  }, [loggedInUser]);

  const filteredPackages = allPackages.filter((pkg) => {
    const lower = searchTerm.toLowerCase();
    const price = parseFloat(pkg.total_price);
    const matchesSearch =
      pkg.name.toLowerCase().includes(lower) ||
      pkg.description.toLowerCase().includes(lower) ||
      pkg.total_price.toString().includes(lower);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesPrice;
  });

  const filteredSubscriptions = filteredPackages.filter(
    (pkg) => pkg.type === "subscription"
  );
  const filteredSingles = filteredPackages.filter(
    (pkg) => pkg.type === "single"
  );

  const promoPackage = filteredSingles.find(
    (pkg) => pkg.id === PROMO_PACKAGE_ID
  );
  const regularSingles = filteredSingles.filter(
    (pkg) => pkg.id !== PROMO_PACKAGE_ID
  );

  return (
    <div className="shop-container px-md-4 px-2">
      {/* Search Bar: full width above all */}
      <div className="rainbow-spin-wrapper mt-md-4 my-2 position-relative shop-search-bar">
        <input
          type="text"
          className="rainbow-spin-input pe-5"
          placeholder="Search packages by name, description, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bi bi-search rainbow-search-icon"></i>
      </div>

      {/* Page Content: sidebar + main content */}
      <div
        className={`container-fluid mt-4 pt-2 fade-container ${
          isVisible ? "fade-in" : "fade-start"
        }`}
      >
        <div className="row">
          <div className="col-md-3 col-lg-2 mb-4 d-none d-md-block">
            <ShopFilterSidebar
              showSubscriptions={showSubscriptions}
              showPoints={showPoints}
              setShowSubscriptions={setShowSubscriptions}
              setShowPoints={setShowPoints}
              minPrice={minPrice}
              maxPrice={maxPrice}
              tempMinPrice={tempMinPrice}
              tempMaxPrice={tempMaxPrice}
              setTempMinPrice={setTempMinPrice}
              setTempMaxPrice={setTempMaxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          {/* Main Content: 4/5 width */}
          <div className="col-md-9 col-lg-10">
            {/* Promo Card */}
            {promoPackage && (
              <PromoCard
                pkg={promoPackage}
                loggedInUser={loggedInUser}
                promoReceivedDate={promoReceivedDate}
                addItem={addItem}
                toast={toast}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            )}

            {/* Subscriptions */}
            {((!showSubscriptions && !showPoints) || showSubscriptions) &&
            filteredSubscriptions.length > 0 ? (
              <>
                <h3 className="text-start text-danger server-status-title mb-2 pt-2">
                  ZLG <span className="text-white ms-2">Subscriptions</span>
                  <span className="server-status-line"></span>
                </h3>
                <Subscriptions
                  subscriptions={filteredSubscriptions}
                  addItem={addItem}
                  toast={toast}
                  loggedInUser={loggedInUser}
                />
              </>
            ) : null}
            {/* Points */}
            {((!showSubscriptions && !showPoints) || showPoints) &&
            regularSingles.length > 0 ? (
              <>
                <h3 className="text-start text-danger server-status-title mb-3 py-2">
                  Buy <span className="text-white ms-2">Points</span>
                  <span className="server-status-line"></span>
                </h3>
                <Points
                  packages={regularSingles}
                  cartItems={cartItems}
                  addItem={addItem}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  promoReceivedDate={promoReceivedDate}
                  toast={toast}
                  loggedInUser={loggedInUser}
                />
              </>
            ) : null}
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      </div>
    </div>
  );
}
