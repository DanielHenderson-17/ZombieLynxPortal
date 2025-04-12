import { useEffect, useState } from "react";
import { getPackages } from "../../managers/tebexManager";
import { useCart } from "../../contexts/CartContext";
import "../../assets/styles/Shop.css";

export default function Shop() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [allPackages, setAllPackages] = useState([]);
  const { cartItems, addItem, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    getPackages()
      .then((res) => {
        if (res?.data) {
          setAllPackages(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load Tebex packages:", err);
      });
  }, []);

  const filteredPackages = allPackages.filter((pkg) => pkg.type === activeTab);

  return (
    <div className="container mt-4 pt-5">
      <h1 className="text-white text-center mb-4">ZLG Shop</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "subscription" ? "active" : ""
            }`}
            onClick={() => setActiveTab("subscription")}
          >
            Subscriptions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "single" ? "active" : ""}`}
            onClick={() => setActiveTab("single")}
          >
            Buy Points
          </button>
        </li>
      </ul>

      {/* Package Grid */}
      <div className="row justify-content-center">
        {filteredPackages.map((pkg) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={pkg.id}>
            <div className="card h-100">
              <img src={pkg.image} className="card-img-top" alt={pkg.name} />
              <div className="card-body">
                <h5 className="card-title">{pkg.name}</h5>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
                <p className="fw-bold">Price: ${pkg.total_price}</p>
                {pkg.type === "subscription" ? (
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => addItem(pkg, "subscription")}
                  >
                    Subscribe
                  </button>
                ) : (
                  <>
                    {!cartItems.single.find((i) => i.package.id === pkg.id) ? (
                      <button
                        className="btn btn-success w-100"
                        onClick={() => addItem(pkg, "single")}
                      >
                        Buy
                      </button>
                    ) : (
                      <div className="d-flex align-items-center justify-content-between mt-2">
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
                          className="form-control mx-2 text-center"
                          style={{ maxWidth: "80px" }}
                          value={
                            cartItems.single.find(
                              (i) => i.package.id === pkg.id
                            )?.quantity || 1
                          }
                          onChange={(e) =>
                            updateQuantity(
                              pkg.id,
                              Math.max(1, parseInt(e.target.value))
                            )
                          }
                        />

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            const currentQty =
                              cartItems.single.find(
                                (i) => i.package.id === pkg.id
                              )?.quantity || 0;
                            updateQuantity(pkg.id, currentQty + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
