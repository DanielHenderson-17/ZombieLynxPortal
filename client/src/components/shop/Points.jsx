import {
  PROMO_PACKAGE_ID,
  isPromoLocked,
  getPromoUnlockDate,
} from "../../utils/promoLockUtils";

export default function Points({
  packages,
  cartItems,
  addItem,
  updateQuantity,
  removeItem,
  promoReceivedDate,
  toast,
  loggedInUser,
}) {
  const isFree = (pkg) => parseFloat(pkg.total_price) === 0;

  return (
    <div className="row justify-content-start bg-points rounded-3 p-2 pb-5 mb-5">
      {packages.map((pkg) => (
        <div className="col-12 col-md-6 col-lg-3 mb-4 h-100" key={pkg.id}>
          <div className="card buy-card h-100">
            <img src={pkg.image} className="card-img-top" alt={pkg.name} />
            <div className="card-body">
              <h5 className="card-title h-25 mb-2 text-start">{pkg.name}</h5>
              <p
                className="card-text text-start mb-1"
                style={{ height: "50px" }}
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
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
                        top: "-.9em",
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

              {!cartItems.single.find((i) => i.package.id === pkg.id) ? (
                !loggedInUser && pkg.name.includes("300ZP") ? (
                  <button
                    className="btn btn-warning mt-1 d-flex justify-content-start"
                    disabled
                  >
                    Login to Claim
                  </button>
                ) : pkg.id === PROMO_PACKAGE_ID &&
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
                ) : (
                  <button
                    className="btn btn-success mt-2 d-flex justify-content-start px-2 py-1"
                    onClick={() => {
                      addItem(pkg, "single");
                      toast.success(`${pkg.name} added to cart!`);
                    }}
                  >
                    Add to Cart
                  </button>
                )
              ) : (
                <div className="d-flex align-items-center justify-content-start mt-2">
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
                    style={{ maxWidth: "50px" }}
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
  );
}
