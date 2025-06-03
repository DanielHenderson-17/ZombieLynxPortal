import ReactSlider from "react-slider";

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
}) {
  const resetPriceRange = () => {
    setTempMinPrice(0);
    setTempMaxPrice(100);
    setMinPrice(0);
    setMaxPrice(100);
  };

  return (
    <div
      className="bg-dark text-white p-3 rounded mt-3"
      style={{
        position: "sticky",
        top: "100px",
        zIndex: 1,
      }}
    >
      <h5 className="text-start fw-bold mb-3">Shop Items</h5>

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
