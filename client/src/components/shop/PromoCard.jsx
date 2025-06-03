import { getPromoUnlockDate, isPromoLocked } from "../../utils/promoLockUtils";
import { useNavigate } from "react-router-dom";

export default function PromoCard({
  pkg,
  loggedInUser,
  promoReceivedDate,
  addItem,
  toast,
  cartItems,
}) {
  const isInCart = cartItems.single.find((i) => i.package.id === pkg.id);
  const navigate = useNavigate();

  return (
    <div className="buy-card2 my-3 w-100 text-white">
      {/* Row: Image + Text */}
      <div className="d-flex flex-row align-items-center gap-3 px-3 pt-3 pb-1">
        {/* Image */}
        <div style={{ flex: "0 0 auto" }}>
          <img
            src={pkg.image}
            alt={pkg.name}
            className="img-fluid rounded"
            style={{
              maxHeight: "50px",
              maxWidth: "50px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Name + Description */}
        <div className="text-start" style={{ flex: "1 1 auto" }}>
          <h5 className="card-title mb-1">{pkg.name}</h5>
          <h6
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: pkg.description }}
          />
        </div>

        <div
          className="me-2 d-inline-flex flex-column align-items-center justify-content-center align-self-start"
          style={{
            width: "4.5rem",
          }}
        >
          <div
            className="shake-gift"
            style={{
              fontSize: "1.5rem",
              lineHeight: "1",
            }}
          >
            🎁
          </div>
          <span className="fs-6 mt-1 text-white d-none d-md-block">
            Free Gift!!
          </span>
        </div>
      </div>

      {/* Row: Button */}
      <div className="px-3 pb-3">
        {!isInCart ? (
          !loggedInUser && pkg.name.includes("300ZP") ? (
            <button
              className="btn btn-warning w-100"
              onClick={() => navigate("/login")}
            >
              Login to Claim
            </button>
          ) : isPromoLocked(promoReceivedDate) ? (
            <button
              className="btn btn-secondary w-100"
              disabled
              title={`Redeemable on ${getPromoUnlockDate(promoReceivedDate)}`}
            >
              Redeemable on {getPromoUnlockDate(promoReceivedDate)}
            </button>
          ) : (
            <button
              className="btn btn-success w-100"
              onClick={() => {
                addItem(pkg, "single");
                toast.success(`${pkg.name} added to cart!`);
              }}
            >
              Claim Free Package
            </button>
          )
        ) : (
          <p className="text-success mb-0">Already in cart ✅</p>
        )}
      </div>
    </div>
  );
}
