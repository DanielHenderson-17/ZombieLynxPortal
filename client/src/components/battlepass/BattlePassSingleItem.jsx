import { battlePassImageMap } from "../../utils/battlePassImageMap";

export default function BattlePassSingleItem({
  reward,
  level,
  claimableLevels,
}) {
  if (!reward) return null;

  const isClaimable = claimableLevels.includes(Number(level));

  return (
    <div className="d-flex flex-column justify-content-start align-items-center text-white bp-single-item mt-4 pt-2">
      <img
        src={battlePassImageMap[reward.img]}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="h-auto"
        style={{ objectFit: "contain", width: "65%" }}
      />

      {isClaimable && (
        <button className="btn btn-success mt-3 px-4 fw-bold">
          CLAIM REWARD
        </button>
      )}
    </div>
  );
}
