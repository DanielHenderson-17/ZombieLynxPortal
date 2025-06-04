import { useEffect, useState } from "react";
import Tebex from "@tebexio/tebex.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../managers/authManager";
import { checkBasketComplete } from "../../utils/checkBasketComplete";
import PostPurchaseModal from "./PostPurchaseModal";
import {
  createBasket,
  authenticateBasket,
  addPackageToBasket,
  markPromoClaimed,
} from "../../managers/tebexManager";
import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [basketIdent, setBasketIdent] = useState(null);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [highlightItemId, setHighlightItemId] = useState(null);
  const [pulsingItemId, setPulsingItemId] = useState(null);
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState(null);
  const isFree = (pkg) => parseFloat(pkg.total_price) === 0;
  const [showPostPurchaseModal, setShowPostPurchaseModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const singleItems = cartItems.single;
  const subscription = cartItems.subscription;

  const total = singleItems.reduce(
    (sum, item) => sum + item.package.total_price * item.quantity,
    subscription ? subscription.total_price : 0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const pollForCompletion = async () => {
      try {
        const token = getToken();
        const confirmed = await checkBasketComplete(basketIdent, token);

        if (confirmed) {
          toast.success("Thanks for your purchase!", { autoClose: 3000 });

          // 🔁 Trigger UI update in NavBar or other components
          setTimeout(() => {
            const now = Date.now().toString();
            localStorage.setItem("zlg-points-updated", now);
            window.dispatchEvent(
              new StorageEvent("storage", {
                key: "zlg-points-updated",
                newValue: now,
              })
            );
          }, 5000);

          clearCart();
          setBasketIdent(null);
          setCheckoutStarted(false);
          setShowPostPurchaseModal(true);
          if (singleItems.some((item) => item.package.id === 6036704)) {
            markPromoClaimed(6036704, token)
              .then((res) => {
                if (!res.ok) console.error("❌ Promo claim failed");
              })
              .catch((err) => {
                console.error("❌ Error marking promo claim:", err);
              });
          }
        }
      } catch (err) {
        console.error("Polling failed or timed out:", err);
        toast.error(
          "Unable to confirm your purchase. Please check your receipt."
        );
        setBasketIdent(null);
        setCheckoutStarted(false);
      }
    };

    if (checkoutStarted && basketIdent) {
      pollForCompletion();
    }
  }, [checkoutStarted, basketIdent]);

  useEffect(() => {
    const stillExists = singleItems.some(
      (item) => item.package.id === highlightItemId
    );

    if (!stillExists && highlightItemId !== null) {
      setHighlightItemId(null);
      setCheckoutErrorMessage(null);
    }
  }, [singleItems, highlightItemId]);

  const handleCheckout = async () => {
    const items = [];
    setCheckoutErrorMessage(null);

    if (subscription) {
      items.push({ packageId: subscription.id.toString(), quantity: 1 });
    }

    for (const item of singleItems) {
      items.push({
        packageId: item.package.id.toString(),
        quantity: item.quantity,
      });
    }

    try {
      const token = getToken();

      const { data } = await createBasket(items, token);
      const ident = data.ident;

      const authOptions = await authenticateBasket(ident, token);
      toast.info("Please Sign in to Steam to continue...");

      await new Promise((res) => setTimeout(res, 3000));

      const popup = window.open(authOptions[0].url, "_blank");

      const waitingToastId = toast.info(
        "Please Sign in to Steam to continue...",
        {
          autoClose: false,
        }
      );

      await new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            resolve();
          }
        }, 500);
      });

      toast.dismiss(waitingToastId);
      toast.success("You are now signed in to Steam!");

      for (const item of items) {
        try {
          await addPackageToBasket(ident, item, token);
        } catch (err) {
          if (err.data?.error === "limit_reached") {
            setCheckoutErrorMessage(
              err.data?.message || "An error occurred during checkout."
            );
            console.error("🚫 Package limit hit:", item);

            setHighlightItemId(parseInt(item.packageId));

            setPulsingItemId(parseInt(item.packageId));
            setTimeout(() => setPulsingItemId(null), 3000);

            return;
          }

          console.error("❌ Unexpected error adding package:", err);
          toast.error("There was a problem adding items to your checkout.");
          return;
        }
      }

      Tebex.checkout.init({
        ident,
        theme: "dark",
      });

      Tebex.checkout.launch();

      // 🔁 Set state for polling
      setBasketIdent(ident);
      setCheckoutStarted(true);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("There was a problem creating your checkout.");
    }
  };

  return (
    <div
      className={`container text-white rounded fade-container ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <h3 className="text-start text-danger server-status-title mb-0 mt-5 pt-5">
        Your <span className="text-white ms-2">Cart</span>
        <span className="server-status-line"></span>
      </h3>

      <div className="cart p-5 rounded mt-5">
        {singleItems.length === 0 && !subscription ? (
          <h5 className="text-start text-white">
            Your cart is empty{" "}
            <a
              href="/shop"
              className="d-block text-teal fs-6 text-decoration-none pt-2"
            >
              Continue Shopping...
            </a>
          </h5>
        ) : (
          <>
            {/* Subscription */}
            {subscription && (
              <div className="row align-items-center mb-2 p-md-3 p-1 rounded cart-item">
                <div className="col-md-7 d-flex align-items-center">
                  <img
                    src={subscription.image}
                    alt={subscription.name}
                    className="cart-item-img me-3"
                  />
                  <span className="text-start">{subscription.name}</span>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-1 text-center d-none d-md-block">
                  ${subscription.total_price.toFixed(2)}
                </div>
                <div className="col-md-1 text-center d-none d-md-block">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeItem(subscription.id, "subscription")}
                  >
                    <i className="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
                <div className="d-md-none d-flex justify-content-end align-items-center mt-3">
                  <div className="col-md-1 text-center me-3">
                    ${subscription.total_price.toFixed(2)}
                  </div>
                  <div className="col-md-1 text-center">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        removeItem(subscription.id, "subscription")
                      }
                    >
                      <i className="bi bi-trash-fill fs-6"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Single Items */}
            {singleItems.length > 0 && (
              <div className="mb-4">
                {singleItems.map((item) => (
                  <div
                    key={item.package.id}
                    className={`row align-items-center mb-2 p-md-3 p-1 rounded cart-item ${
                      highlightItemId === item.package.id
                        ? "border border-danger border-1"
                        : ""
                    } ${pulsingItemId === item.package.id ? "pulse" : ""}`}
                  >
                    <div className="col-md-7 d-flex align-items-center">
                      <img
                        src={item.package.image}
                        alt={item.package.name}
                        className="cart-item-img me-3"
                      />
                      <span className="text-start">{item.package.name}</span>
                    </div>
                    <div className="col-md-3 d-md-flex justify-content-end align-items-center d-none">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          const newQty = item.quantity - 1;
                          if (newQty <= 0) removeItem(item.package.id);
                          else updateQuantity(item.package.id, newQty);
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="form-control mx-2 text-center cart-qty-input p-1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = Math.max(1, parseInt(e.target.value));
                          if (isFree(item.package) && newQty > 1) {
                            toast.error("You can only add one of a free item.");
                            return;
                          }
                          updateQuantity(item.package.id, newQty);
                        }}
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          if (isFree(item.package) && item.quantity >= 1) {
                            toast.error("You can only add one of a free item.");
                            return;
                          }
                          updateQuantity(item.package.id, item.quantity + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="col-md-1 text-center d-none d-md-block">
                      ${(item.package.total_price * item.quantity).toFixed(2)}
                    </div>
                    <div className="col-md-1 text-center d-none d-md-block">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.package.id)}
                      >
                        <i className="bi bi-trash-fill fs-5"></i>
                      </button>
                    </div>
                    <div className="d-md-flex d-none justify-content-end align-items-center mt-3">
                      <div className="col-md-3 d-flex justify-content-end align-items-center d-md-none me-3">
                        <button
                          className="btn btn-sm btn-outline-secondary py-0"
                          onClick={() => {
                            const newQty = item.quantity - 1;
                            if (newQty <= 0) removeItem(item.package.id);
                            else updateQuantity(item.package.id, newQty);
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          className="form-control mx-2 text-center cart-qty-input py-0"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = Math.max(
                              1,
                              parseInt(e.target.value)
                            );
                            if (isFree(item.package) && newQty > 1) {
                              toast.error(
                                "You can only add one of a free item."
                              );
                              return;
                            }
                            updateQuantity(item.package.id, newQty);
                          }}
                        />
                        <button
                          className="btn btn-sm btn-outline-secondary py-0"
                          onClick={() => {
                            if (isFree(item.package) && item.quantity >= 1) {
                              toast.error(
                                "You can only add one of a free item."
                              );
                              return;
                            }
                            updateQuantity(item.package.id, item.quantity + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div className="col-md-1 text-center d-md-none me-3">
                        ${(item.package.total_price * item.quantity).toFixed(2)}
                      </div>
                      <div className="col-md-1 text-center d-md-none">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item.package.id)}
                        >
                          <i className="bi bi-trash-fill fs-6"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h5 className="text-end mt-3 mb-0">
              Subtotal: ${total.toFixed(2)}
            </h5>

            {/* Total + Actions */}
            <div className="d-flex justify-content-end align-items-center border-top pt-3 mt-4">
              <div>
                <button className="btn btn-primary me-2">
                  <a
                    href="/shop"
                    className="d-block text-white fs-6 text-decoration-none"
                  >
                    Continue Shopping
                  </a>
                </button>
                <button className="btn btn-success" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
        <div className="pt-5">
          {checkoutErrorMessage && (
            <i className="text-danger d-block mb-2">{checkoutErrorMessage}</i>
          )}
          <i className="fs-6 text-secondary">
            Zombie Lynx Gaming does not collect any of your personal information
            during checkout or purchases. All purchases are handled through
            Tebex.
          </i>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      <PostPurchaseModal
        show={showPostPurchaseModal}
        onClose={() => setShowPostPurchaseModal(false)}
      />
    </div>
  );
}
