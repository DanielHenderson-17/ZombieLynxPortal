import ReactSlider from "react-slider";
import { useState, useEffect } from "react";

export default function ShopFilterSidebar({
  showSubscriptions,
  showPoints,
  setShowSubscriptions,
  setShowPoints,
  tempMinPrice,
  tempMaxPrice,
  setTempMinPrice,
  setTempMaxPrice,
  setMinPrice,
  setMaxPrice,
  packages,
  addItem,
  toast,
  cartItems,
  loggedInUser,
}) {
  const resetPriceRange = () => {
    setTempMinPrice(0);
    setTempMaxPrice(100);
    setMinPrice(0);
    setMaxPrice(100);
  };

  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    if (!packages || packages.length === 0) return;
    const shuffled = [...packages].sort(() => 0.5 - Math.random());
    setPopularItems(shuffled.slice(0, 3));
  }, []);

  return (
    <div
      className="bg-dark text-white p-3 rounded mt-3"
      style={{
        position: "sticky",
        top: "100px",
        zIndex: 1,
      }}
    >
      {/* Most Popular */}
      <h5 className="text-start fw-bold mb-3">Most Popular</h5>
      <ul className="list-unstyled mb-3 text-start">
        {popularItems.map((item) => {
          const isFree = parseFloat(item.total_price) === 0;
          const alreadyInCart = cartItems.single.find(
            (i) => i.package.id === item.id
          );

          return (
            <li
              key={item.id}
              className="mb-2 d-flex justify-content-between align-items-start"
            >
              <div className="me-2 flex-grow-1">
                <div className="fw-semibold">{item.name}</div>
                <div className="text-secondary small">
                  ${parseFloat(item.total_price).toFixed(2)}
                </div>
              </div>

              {alreadyInCart ? (
                <button className="btn btn-sm btn-secondary" disabled>
                  In Cart
                </button>
              ) : !loggedInUser && item.name.includes("300ZP") ? (
                <button className="btn btn-sm btn-warning" disabled>
                  Login to Claim
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    if (isFree) {
                      // prevent adding >1 of free item
                      const alreadyFree = cartItems.single.find(
                        (i) => i.package.id === item.id
                      );
                      if (alreadyFree) {
                        toast.error("You can only add one of a free item.");
                        return;
                      }
                    }

                    addItem(item, "single");
                    toast.success(`${item.name} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <hr />

      <h5 className="text-start fw-bold mb-3 mt-5">Shop Items</h5>

      {/* Checkboxes */}
      <div className="form-check mb-2 text-start">
        <input
          className="form-check-input"
          type="checkbox"
          id="filter-subscriptions"
          checked={showSubscriptions}
          onChange={() => setShowSubscriptions(!showSubscriptions)}
        />
        <label className="form-check-label ms-1" htmlFor="filter-subscriptions">
          Subscriptions
        </label>
      </div>

      <div className="form-check mb-2 text-start">
        <input
          className="form-check-input"
          type="checkbox"
          id="filter-points"
          checked={showPoints}
          onChange={() => setShowPoints(!showPoints)}
        />
        <label className="form-check-label ms-1" htmlFor="filter-points">
          Points
        </label>
      </div>

      <div className="form-check mb-3 text-start">
        <input
          className="form-check-input"
          type="checkbox"
          id="filter-battlepass"
          disabled
        />
        <label
          className="form-check-label ms-1 text-white"
          htmlFor="filter-battlepass"
        >
          BattlePass <small>(Coming Soon)</small>
        </label>
      </div>

      <hr />

      {/* Price Filter */}
      <div className="text-start mb-3">
        <label className="fw-bold d-block mb-1">Price</label>
        <div className="mb-2">
          ${tempMinPrice} – ${tempMaxPrice}+
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="flex-grow-1">
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="thumb"
              trackClassName="track"
              value={[tempMinPrice, tempMaxPrice]}
              min={0}
              max={100}
              step={1}
              onChange={([min, max]) => {
                setTempMinPrice(min);
                setTempMaxPrice(max);
              }}
            />
          </div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => {
              setMinPrice(tempMinPrice);
              setMaxPrice(tempMaxPrice);
            }}
          >
            Go
          </button>
        </div>
        <button
          className="btn btn-link btn-sm px-0 mt-2 text-decoration-underline text-info"
          onClick={resetPriceRange}
        >
          Reset price range
        </button>
      </div>
    </div>
  );
}
