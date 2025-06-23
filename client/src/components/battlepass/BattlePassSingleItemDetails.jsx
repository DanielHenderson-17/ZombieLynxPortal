import { formatLabel } from "../../utils/formatLabel";

export default function BattlePassSingleItemDetails({ selectedItem }) {
  if (!selectedItem) return null;

  const { category, id, compatibility } = selectedItem;

  return (
    <div className="bp-item-details text-white p-3 text-start">
      <div className="fs-6 text-uppercase text-warning mb-1">{category}</div>
      <div className="fs-5 fw-bold mb-1">{formatLabel(id)}</div>
      <div className="text-secondary small">
        Compatibility: {compatibility.join(", ")}
      </div>
    </div>
  );
}
