import { formatLabel } from "../../utils/formatLabel";
import { getCompatibilityGame } from "../../utils/getCompatibilityGame";
import { getRarityGradientClass } from "../../utils/getRarityGradientClass";

export default function BattlePassSingleItemDetails({ selectedItem }) {
  if (!selectedItem) return null;

  const { category, id, compatibility, rarity, amount } = selectedItem;

  return (
    <div className="bp-item-details text-white p-md-3 p-1 text-start">
      <div className="fs-6 text-white mb-1 d-flex align-items-center gap-2 justify-content-md-start justify-content-center">
        <span className={`rarity-box ${getRarityGradientClass(0, rarity)}`} />
        <span className="text-uppercase">{rarity}</span>
        <span className="text-secondary">|</span>
        <span className="text-white">{category}</span>
      </div>

      <div className="fs-5 fw-bold d-inline-flex align-items-center gap-2">
        <>
          {formatLabel(id)}{" "}
          {amount > 1 && <span className="text-white">x{amount}</span>}
        </>
      </div>

      <div className="d-flex align-items-center gap-1 mt-1 justify-content-md-start justify-content-center">
        <span className="text-secondary">Compatibility:</span>
        {compatibility.map((game) => (
          <img
            key={game}
            src={getCompatibilityGame(game)}
            alt=""
            loading="lazy"
            aria-hidden="true"
            title={game}
            className="rounded-5 border border-dark shadow-lg"
            style={{ width: "20px", height: "20px", objectFit: "contain" }}
          />
        ))}
      </div>
    </div>
  );
}
