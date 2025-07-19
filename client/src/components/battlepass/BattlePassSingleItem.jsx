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
    <div className="d-flex flex-column justify-content-start align-items-center text-white bp-single-item mt-md-2 mt-0 pt-md-2 pt-1 mobile-single-item">
      <img
        src={battlePassImageMap[reward.img]}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="bp-single-item-img h-auto"
      />

      {isClaimable && !isClaimed && (
        <button
          className="btn btn-success mt-md-3 mt-1 px-4 fw-bold claim-button"
          onClick={() => onClaim?.(Number(level))}
        >
          CLAIM REWARD
        </button>
      )}

      {isClaimed && (
        <button
          className="btn btn-secondary mt-md-3 mt-1 px-4 fw-bold d-flex align-items-center gap-2 claim-button"
          disabled
        >
          <i className="bi bi-check-lg fs-5"></i>
          CLAIMED
        </button>
      )}
    </div>
  );
}
