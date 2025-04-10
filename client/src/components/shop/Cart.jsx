import { useCart } from "../../contexts/CartContext";
import "../../assets/styles/Cart.css";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();

  const singleItems = cartItems.single;
  const subscription = cartItems.subscription;

  const total = singleItems.reduce(
    (sum, item) => sum + item.package.total_price * item.quantity,
    subscription ? subscription.total_price : 0
  );

  return (
    <div className="container mt-5 text-white">
      <h2 className="mb-4">Your Cart</h2>

      {/* Subscription */}
      {subscription && (
        <div className="mb-4 p-3 border border-secondary rounded">
          <h5>Subscription</h5>
          <div className="d-flex justify-content-between align-items-center">
            <span>{subscription.name}</span>
            <span>${subscription.total_price.toFixed(2)}</span>
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => removeItem(subscription.id, "subscription")}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Single Items */}
      {singleItems.length > 0 && (
        <div className="mb-4">
          <h5>Point Packs</h5>
          {singleItems.map((item) => (
            <div
              key={item.package.id}
              className="d-flex justify-content-between align-items-center mb-2 p-3 border border-secondary rounded"
            >
              <span>{item.package.name}</span>
              <div className="d-flex align-items-center">
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
                  className="form-control mx-2 text-center"
                  style={{ width: "60px" }}
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
                <span className="ms-3">
                  ${(item.package.total_price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => removeItem(item.package.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total + Actions */}
      <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
        <h4>Total: ${total.toFixed(2)}</h4>
        <div>
          <button className="btn btn-outline-light me-2" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="btn btn-success">Checkout</button>
        </div>
      </div>
    </div>
  );
}
