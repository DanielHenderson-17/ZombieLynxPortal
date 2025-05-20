import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPackages } from "../../managers/tebexManager";
import { useCart } from "../../contexts/CartContext";
import { findSubscriptionByName } from "../../utils/subscriptionFinder";
import {
  PROMO_PACKAGE_ID,
  isPromoLocked,
  getPromoUnlockDate,
} from "../../utils/promoLockUtils";
import { getPromoStatus } from "../../managers/tebexManager";
import { getToken } from "../../managers/authManager";
import "./Shop.css";

export default function Shop({ loggedInUser }) {
  const [allPackages, setAllPackages] = useState([]);
  const { cartItems, addItem, updateQuantity, removeItem } = useCart();
  const isFree = (pkg) => parseFloat(pkg.total_price) === 0;
  const [isVisible, setIsVisible] = useState(false);
  const [promoReceivedDate, setPromoReceivedDate] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getPackages()
      .then((res) => {
        if (res?.data) setAllPackages(res.data);
      })
      .catch((err) => {
        console.error("Failed to load Tebex packages:", err);
      });
  }, []);

  useEffect(() => {
    const token = getToken();
    getPromoStatus(token)
      .then((res) => setPromoReceivedDate(res.promoReceivedDate))
      .catch((err) => console.error("Failed to fetch promo status:", err));
  }, []);

  const goldenLynx = findSubscriptionByName(allPackages, "Gold");
  const diamondLynx = findSubscriptionByName(allPackages, "Diamond");
  const vibraniumLynx = findSubscriptionByName(allPackages, "Vibranium");

  if (!loggedInUser) return null;

  return (
    <div
      className={`container mt-4 pt-5 fade-container ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">Subscriptions</span>
        <span className="server-status-line"></span>
      </h3>
      {/* Subscriptions */}
      <div className="row mx-0 text-white py-md-3 py-0 border-0 services-table-bg rounded-3">
        {/* Golden Lynx */}
        <div className="col-md-6 col-lg-4 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative golden-border">
            <span className="subscription-badge golden-badge">Golden Lynx</span>
            <img
              className="col-6"
              src="/images/goldenlynx.png"
              alt="Golden Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$4.99 / month</h4>
            <button
              className="btn btn-danger mb-3 mx-2"
              onClick={() => {
                if (goldenLynx) {
                  addItem(goldenLynx, "subscription");
                  toast.success("Golden Lynx added to cart!");
                }
              }}
            >
              Subscribe
            </button>

            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Golden Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "650 ZP Every Month!",
                "7 ZP Every 15 Minutes",
                // "10x Ingots, 5x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#ffd700"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>

                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diamond Lynx */}
        <div className="col-md-6 col-lg-4 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative diamond-border">
            <span className="subscription-badge diamond-badge">
              Diamond Lynx
            </span>
            <img
              className="col-6"
              src="/images/diamondlynx.png"
              alt="Diamond Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$9.99 / month</h4>
            <button
              className="btn btn-danger mb-3 mx-2"
              onClick={() => {
                if (diamondLynx) {
                  addItem(diamondLynx, "subscription");
                  toast.success("Diamond Lynx added to cart!");
                }
              }}
            >
              Subscribe
            </button>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Diamond Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "1300 ZP Every Month!",
                "10 ZP Every 15 Minutes",
                // "15x Ingots, 7x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#00bfff"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>

                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vibranium Lynx */}
        <div className="col-md-6 col-lg-4 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-md-4 mb-2 p-3 position-relative vibranium-border">
            <span className="subscription-badge vibranium-badge">
              Vibranium Lynx
            </span>
            <img
              className="col-6"
              src="/images/vibraniumlynx.png"
              alt="Vibranium Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$14.99 / month</h4>
            <button
              className="btn btn-danger mb-3 mx-2"
              onClick={() => {
                if (vibraniumLynx) {
                  addItem(vibraniumLynx, "subscription");
                  toast.success("Vibranium Lynx added to cart!");
                }
              }}
            >
              Subscribe
            </button>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Vibranium Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "1950 ZP Every Month!",
                "15 ZP Every 15 Minutes",
                // "20x Ingots, 10x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#8a2be2"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>

                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Buy Points */}
      <h3 className="text-start text-danger server-status-title mb-3">
        Buy <span className="text-white ms-2">Points</span>
        <span className="server-status-line"></span>
      </h3>
      <div className="row justify-content-center">
        {allPackages
          .filter((pkg) => pkg.type === "single")
          .map((pkg) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4 h-100" key={pkg.id}>
              <div className="card buy-card h-100">
                <img src={pkg.image} className="card-img-top" alt={pkg.name} />
                <div className="card-body">
                  <h6 className="card-title h-25 mb-3">{pkg.name}</h6>
                  <p
                    className="card-text"
                    style={{ height: "50px" }}
                    dangerouslySetInnerHTML={{ __html: pkg.description }}
                  />
                  <p className="fw-bold">Price: ${pkg.total_price}</p>
                  {!cartItems.single.find((i) => i.package.id === pkg.id) &&
                  pkg.id === PROMO_PACKAGE_ID &&
                  isPromoLocked(promoReceivedDate) ? (
                    <button
                      className="btn btn-secondary w-100"
                      disabled
                      title={`Redeemable on ${getPromoUnlockDate(
                        promoReceivedDate
                      )}`}
                    >
                      Redeemable on {getPromoUnlockDate(promoReceivedDate)}
                    </button>
                  ) : !cartItems.single.find((i) => i.package.id === pkg.id) ? (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => {
                        addItem(pkg, "single");
                        toast.success(`${pkg.name} added to cart!`);
                      }}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center mt-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const current = cartItems.single.find(
                            (i) => i.package.id === pkg.id
                          );
                          const newQty = current.quantity - 1;
                          if (newQty <= 0) removeItem(pkg.id, "single");
                          else updateQuantity(pkg.id, newQty);
                        }}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        className="form-control mx-4 text-center"
                        style={{ maxWidth: "80px" }}
                        value={
                          cartItems.single.find((i) => i.package.id === pkg.id)
                            ?.quantity || 1
                        }
                        onChange={(e) => {
                          const newQty = Math.max(1, parseInt(e.target.value));
                          if (isFree(pkg) && newQty > 1) {
                            toast.error("You can only add one of a free item.");
                            return;
                          }
                          updateQuantity(pkg.id, newQty);
                        }}
                      />

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const currentItem = cartItems.single.find(
                            (i) => i.package.id === pkg.id
                          );
                          const currentQty = currentItem?.quantity || 0;

                          if (isFree(pkg) && currentQty >= 1) {
                            toast.error("You can only add one of a free item.");
                            return;
                          }

                          updateQuantity(pkg.id, currentQty + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
}
