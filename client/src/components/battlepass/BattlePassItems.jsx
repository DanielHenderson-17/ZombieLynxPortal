export default function BattlePassItems({
  xp,
  claimedLevels,
  claimableLevels,
  rewards,
  onSelect,
}) {
  const sortedLevels = Object.keys(rewards)
    .map(Number)
    .sort((a, b) => a - b);

  const getCurrentLevel = () => Math.floor(xp / 100) + 1;
  const getCurrentXp = () => xp % 100;
  const currentLevel = getCurrentLevel();
  const currentXp = getCurrentXp();

  return (
    <div className="d-grid gap-4 bp-item-grid">
      {sortedLevels.map((level) => {
        const reward = rewards[level];
        const isClaimed = claimedLevels.includes(level);
        const isClaimable = claimableLevels.includes(level);
        const isLocked = !isClaimed && !isClaimable;
        const isCurrentLevel = level === currentLevel && !isClaimed;

        const imgClasses = [
          "bp-item-img",
          level % 10 === 0 && "bp-item-big",
          isClaimed && "claimed",
          isClaimable && "claimable",
          isLocked && "locked",
        ]
          .filter(Boolean)
          .join(" ");

        const backgroundClass =
          level === 5 || level === 10 ? "bg-orange-gradient" : "bg-dark-item";

        const borderClass =
          level === 5 || level === 10
            ? "gradient-border"
            : "border border-black";

        return (
          <div
            key={level}
            className={`bp-item-container rounded-1 overflow-hidden text-center position-relative ${
              level === 10 ? "bp-item-big-wrapper" : ""
            }`}
            title={reward.description}
            onClick={() => onSelect(reward)}
            role="button"
            style={{ cursor: "pointer" }}
          >
            {reward.amount > 1 && (
              <div className="bp-item-amount">x{reward.amount}</div>
            )}

            <div
              className={`bp-img-stack rounded ${borderClass} ${backgroundClass} w-100`}
            >
              {isLocked && (
                <i
                  className="bi bi-lock-fill position-absolute top-0 end-0 m-1 text-white fs-5"
                  style={{ zIndex: 2 }}
                  title="Locked"
                />
              )}

              <img
                src={reward.img}
                alt=""
                loading="lazy"
                aria-hidden="true"
                className={imgClasses}
              />

              {isCurrentLevel && (
                <div
                  className="position-absolute start-0 bg-secondary rounded-bottom-5"
                  style={{
                    height: "6px",
                    zIndex: 0,
                    bottom: "1px",
                    width: "99%",
                  }}
                  title={`${xp} / ${level * 100} XP`}
                >
                  <div
                    className="bg-primary rounded-5"
                    style={{
                      height: "100%",
                      width: `${(currentXp / 100) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
