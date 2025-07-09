import { battlePassImageMap } from "../../utils/battlePassImageMap";

export default function BattlePassSingleItem({
  reward,
  level,
  claimableLevels,
  claimedLevels,
  onClaim,
}) {
  if (!reward) return null;

  const isClaimable = claimableLevels.includes(Number(level));
  const isClaimed = claimedLevels.includes(Number(level));

  return (
    <div className="d-flex flex-column justify-content-start align-items-center text-white bp-single-item mt-md-4 mt-0 pt-2">
      <img
        src={battlePassImageMap[reward.img]}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="bp-single-item-img h-auto"
      />

      {isClaimable && !isClaimed && (
        <button
          className="btn btn-success mt-3 px-4 fw-bold"
          onClick={() => onClaim?.(Number(level))}
        >
          CLAIM REWARD
        </button>
      )}

      {isClaimed && (
        <button
          className="btn btn-secondary mt-3 px-4 fw-bold d-flex align-items-center gap-2"
          disabled
        >
          <i className="bi bi-check-lg fs-5"></i>
          CLAIMED
        </button>
      )}
    </div>
  );
}
