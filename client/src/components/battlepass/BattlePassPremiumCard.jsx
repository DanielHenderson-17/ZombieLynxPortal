import { Link } from "react-router-dom";

export default function BattlePassPremiumCard({ hasPremium, premiumImage }) {
  return (
    <div className="text-white border border-black rounded-3 shadow overflow-hidden">
      <div className="position-relative mb-0">
        <img src={premiumImage} alt="Season" loading="lazy" className="w-100" />
        {hasPremium && (
          <div
            className="position-absolute mt-2 me-3 bg-warning text-dark fw-bold px-2 py-1 small rounded-start bp-premium-gradient"
            style={{ top: "0.5rem", right: "-1rem" }}
          >
            25% XP
          </div>
        )}
      </div>

      {!hasPremium ? (
        <Link
          to="/shop"
          className="d-block text-center text-decoration-none bp-premium-gradient py-2 fw-bold"
          style={{
            marginTop: "0",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          BUY PREMIUM PASS
        </Link>
      ) : (
        <div
          className="d-flex justify-content-between align-items-center bp-premium-gradient py-2 px-3 fw-bold"
          style={{
            marginTop: "0",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <span>PREMIUM PURCHASED</span>
          <i className="bi bi-check-circle text-black fs-4" />
        </div>
      )}
    </div>
  );
}
