import Tebex from "@tebexio/tebex.js";
import { getToken } from "../../managers/authManager";
import {
  createBasket,
  authenticateBasket,
  addPackageToBasket,
} from "../../managers/tebexManager";
import { useCart } from "../../contexts/CartContext";
import "../../assets/styles/Cart.css";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const singleItems = cartItems.single;
  const subscription = cartItems.subscription;

  const total = singleItems.reduce(
    (sum, item) => sum + item.package.total_price * item.quantity,
    subscription ? subscription.total_price : 0
  );

  const handleCheckout = async () => {
    const items = [];

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

      // Step 1: Create basket
      const { data } = await createBasket(items, token);
      const ident = data.ident;

      // Step 2: Authenticate basket
      const authOptions = await authenticateBasket(ident, token);
      window.open(authOptions[0].url, "_blank");

      alert(
        "Please complete Steam authentication in the new window, then click OK to continue."
      );

      // Step 3: Add packages
      for (const item of items) {
        await addPackageToBasket(ident, item, token);
        console.log("📦 Package added:", item);
      }

      // Step 4: Launch checkout
      Tebex.checkout.init({
        ident,
        theme: "dark",
      });
      Tebex.checkout.launch();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("There was a problem creating your checkout. Please try again.");
    }
    console.log(
      "🛒 Final payload to backend:",
      JSON.stringify({ items }, null, 2)
    );
  };

  return (
    <div className="container text-white rounded">
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
              className="d-block text-teal fs-6 text-decoration-none"
            >
              Continue Shopping...
            </a>
          </h5>
        ) : (
          <>
            {/* Subscription */}
            {subscription && (
              <div className="row align-items-center mb-2 p-3 rounded cart-item">
                <div className="col-md-7 d-flex align-items-center">
                  <img
                    src={subscription.image}
                    alt={subscription.name}
                    className="cart-item-img me-3"
                  />
                  <span>{subscription.name}</span>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-1 text-center">
                  ${subscription.total_price.toFixed(2)}
                </div>
                <div className="col-md-1 text-center">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeItem(subscription.id, "subscription")}
                  >
                    <i className="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Single Items */}
            {singleItems.length > 0 && (
              <div className="mb-4">
                {singleItems.map((item) => (
                  <div
                    key={item.package.id}
                    className="row align-items-center mb-2 p-3 rounded cart-item"
                  >
                    <div className="col-md-7 d-flex align-items-center">
                      <img
                        src={item.package.image}
                        alt={item.package.name}
                        className="cart-item-img me-3"
                      />
                      <span>{item.package.name}</span>
                    </div>
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
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
                        className="form-control mx-2 text-center cart-qty-input"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.package.id,
                            Math.max(1, parseInt(e.target.value))
                          )
                        }
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.package.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="col-md-1 text-center">
                      ${(item.package.total_price * item.quantity).toFixed(2)}
                    </div>
                    <div className="col-md-1 text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.package.id)}
                      >
                        <i className="bi bi-trash-fill fs-5"></i>
                      </button>
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
      </div>
    </div>
  );
}
