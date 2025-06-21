export default function BattlePass({
  packages,
  cartItems,
  addItem,
  updateQuantity,
  removeItem,
  toast,
  battlePassData,
}) {
  const endDate = new Date(battlePassData?.end).toLocaleDateString();
  const bonusLevels = Math.floor(
    (battlePassData?.premium?.bonusXp || 0) /
      (battlePassData?.xpPerLevel || 100)
  );

  return (
    <div className="row justify-content-start bg-points rounded-3 p-md-2 pb-5 mb-5 p-0">
      {packages.map((pkg) => (
        <div
          className="col-12 col-md-6 col-lg-3 mb-4 h-100 p-md-2 p-0"
          key={pkg.id}
        >
          <div className="card buy-card h-100">
            <div className="card-body">
              {/* Seasonal Info */}
              <div className="mb-3 text-start">
                <h6 className="text-warning mb-1">Seasonal Battle Pass</h6>
                {battlePassData?.img && (
                  <img
                    src={battlePassData.img}
                    alt="Battle Pass Banner"
                    className="img-fluid rounded mb-3"
                    style={{
                      maxHeight: "140px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                )}

                <div className="text-white fw-bold">{battlePassData?.name}</div>
                <div className="text-muted small">Active until: {endDate}</div>
                <div className="text-info small">
                  25% XP Boost · {bonusLevels} Levels Instantly
                </div>
              </div>

              {/* Price Display */}
              {(() => {
                const [dollars, cents] = pkg.total_price.toFixed(2).split(".");
                return (
                  <div className="d-flex align-items-baseline text-start price-display">
                    <span
                      className="text-white"
                      style={{
                        fontSize: "0.75em",
                        marginRight: "2px",
                        position: "relative",
                        top: "-1.1em",
                      }}
                    >
                      $
                    </span>
                    <span
                      className="fw-bold"
                      style={{ fontSize: "2rem", lineHeight: "1" }}
                    >
                      {dollars}
                    </span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        position: "relative",
                        top: "-.9em",
                        marginLeft: "1px",
                      }}
                    >
                      {cents}
                    </span>
                  </div>
                );
              })()}

              {/* Cart Buttons */}
              {!cartItems.single.find((i) => i.package.id === pkg.id) ? (
                <button
                  className="btn btn-success mt-2 d-flex justify-content-start px-2 py-1"
                  onClick={() => {
                    addItem(pkg, "single");
                    toast.success(`${pkg.name} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="d-flex align-items-center justify-content-start mt-1">
                  <div className="d-flex align-items-stretch">
                    <button
                      className="btn btn-outline-secondary rounded-start rounded-end-0 px-3 py-1"
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
                      className="form-control text-center cart-qty-input px-2 py-1 border-secondary bg-dark text-white rounded-0"
                      style={{ width: "55px" }}
                      value={
                        cartItems.single.find((i) => i.package.id === pkg.id)
                          ?.quantity || 1
                      }
                      onChange={(e) => {
                        const newQty = Math.max(1, parseInt(e.target.value));
                        updateQuantity(pkg.id, newQty);
                      }}
                    />

                    <button
                      className="btn btn-outline-secondary rounded-start-0 rounded-end px-3 py-1"
                      onClick={() => {
                        const currentItem = cartItems.single.find(
                          (i) => i.package.id === pkg.id
                        );
                        const currentQty = currentItem?.quantity || 0;
                        updateQuantity(pkg.id, currentQty + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
