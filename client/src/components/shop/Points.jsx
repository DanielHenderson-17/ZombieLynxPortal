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
}) {
  const isFree = (pkg) => parseFloat(pkg.total_price) === 0;

  return (
    <div className="row justify-content-center">
      {packages.map((pkg) => (
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
  );
}
