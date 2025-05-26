import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPackages, getPromoStatus } from "../../managers/tebexManager";
import { getToken } from "../../managers/authManager";
import { useCart } from "../../contexts/CartContext";
import Subscriptions from "./Subscriptions";
import Points from "./Points";
import "./Shop.css";

export default function Shop({ loggedInUser }) {
  const [allPackages, setAllPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [promoReceivedDate, setPromoReceivedDate] = useState(null);
  const { cartItems, addItem, updateQuantity, removeItem } = useCart();

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
    const token = getToken();
    getPromoStatus(token)
      .then((res) => setPromoReceivedDate(res.promoReceivedDate))
      .catch((err) => console.error("Failed to fetch promo status:", err));
  }, []);

  const filteredPackages = allPackages.filter((pkg) => {
    const lower = searchTerm.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(lower) ||
      pkg.description.toLowerCase().includes(lower) ||
      pkg.total_price.toString().includes(lower)
    );
  });

  const filteredSubscriptions = filteredPackages.filter(
    (pkg) => pkg.type === "subscription"
  );
  const filteredSingles = filteredPackages.filter(
    (pkg) => pkg.type === "single"
  );

  if (!loggedInUser) return null;

  return (
    <div
      className={`container mt-4 pt-5 fade-container ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="rainbow-spin-wrapper mt-md-3 my-2 w-100 position-relative">
        <input
          type="text"
          className="rainbow-spin-input pe-5"
          placeholder="Search packages by name, description, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bi bi-search rainbow-search-icon"></i>
      </div>

      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">Subscriptions</span>
        <span className="server-status-line"></span>
      </h3>
      <Subscriptions
        subscriptions={filteredSubscriptions}
        addItem={addItem}
        toast={toast}
      />

      <h3 className="text-start text-danger server-status-title mb-3">
        Buy <span className="text-white ms-2">Points</span>
        <span className="server-status-line"></span>
      </h3>
      <Points
        packages={filteredSingles}
        cartItems={cartItems}
        addItem={addItem}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        promoReceivedDate={promoReceivedDate}
        toast={toast}
      />

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
}
