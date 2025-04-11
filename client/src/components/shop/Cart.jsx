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
    <div className="container text-white rounded">
      <h3 className="text-start text-danger server-status-title mb-0 mt-5 pt-5">
        Your <span className="text-white ms-2">Cart</span>
        <span className="server-status-line"></span>
      </h3>

      <div className="cart p-5 rounded mt-5">
        {/* Subscription */}
        {subscription && (
          <div className="row align-items-center mb-2 p-3 rounded cart-item">
            {/* Image + Name */}
            <div className="col-md-7 d-flex align-items-center">
              <img
                src={subscription.image}
                alt={subscription.name}
                className="cart-item-img me-3"
              />
              <span>{subscription.name}</span>
            </div>
            <div className="col-md-3"></div>

            {/* Price */}
            <div className="col-md-1 text-center">
              ${subscription.total_price.toFixed(2)}
            </div>

            {/* Remove */}
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
                {/* Image + Name */}
                <div className="col-md-7 d-flex align-items-center">
                  <img
                    src={item.package.image}
                    alt={item.package.name}
                    className="cart-item-img me-3"
                  />
                  <span>{item.package.name}</span>
                </div>

                {/* Quantity Controls */}
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

                {/* Price */}
                <div className="col-md-1 text-center">
                  ${(item.package.total_price * item.quantity).toFixed(2)}
                </div>

                {/* Remove */}
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

        {/* Total + Actions */}
        <div className="d-flex justify-content-end align-items-center border-top pt-3 mt-4">
          <h4 className="me-3">Total: ${total.toFixed(2)}</h4>
          <div>
            <button className="btn btn-outline-light me-2" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="btn btn-success">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
