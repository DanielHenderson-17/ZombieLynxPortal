import { getRarityGradientClass } from "../../utils/getRarityGradientClass";
import { battlePassImageMap } from "../../utils/battlePassImageMap";
import { useRef } from "react";
import hoverSound from "../../assets/battlepass/hover.ogg";

export default function BattlePassItems({
  xp,
  claimedLevels,
  claimableLevels,
  rewards,
  onSelect,
  selectedItem,
  activeTab,
}) {
  const sortedLevels = Object.keys(rewards)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((level) => level > (activeTab - 1) * 10 && level <= activeTab * 10);

  const getCurrentLevel = () => Math.floor(xp / 100) + 1;
  const getCurrentXp = () => xp % 100;
  const currentLevel = getCurrentLevel();
  const currentXp = getCurrentXp();
  const hoverAudioRef = useRef(new Audio(hoverSound));
  hoverAudioRef.current.volume = 0.02;

  return (
    <div className="d-grid gap-md-4 gap-2 bp-item-grid mb-md-2 mb-0 mt-0 py-md-0 py-2">
      {sortedLevels.map((level) => {
        const reward = rewards[level.toString()];

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

        const isLegendary = reward.rarity?.toLowerCase() === "legendary";

        const backgroundClass =
          isLegendary && !isClaimed ? "bg-orange-gradient" : "bg-dark-item";

        const validRarities = [
          "common",
          "uncommon",
          "rare",
          "epic",
          "legendary",
        ];
        const lowerRarity = reward.rarity?.toLowerCase();
        const borderClass = validRarities.includes(lowerRarity)
          ? `${lowerRarity}-gradient-border`
          : "border border-black";

        return (
          <div
            key={level}
            className={`bp-item-container rounded-1 overflow-hidden text-center position-relative ${
              level === 10 ? "bp-item-big-wrapper" : ""
            } ${reward === selectedItem ? "bp-item-container-selected" : ""}`}
            title={reward.description}
            onClick={() => onSelect(reward)}
            onMouseEnter={() => {
              const audio = hoverAudioRef.current;
              audio.currentTime = 0;
              audio.play();
            }}
            role="button"
            style={{ cursor: "pointer" }}
          >
            {/* Rarity tag above the image */}
            <div
              className={`w-100 rarity-tag rounded-1 ${getRarityGradientClass(
                level,
                reward.rarity
              )}`}
            />

            <div
              className={`bp-img-stack rounded ${borderClass} ${backgroundClass} w-100`}
            >
              {reward.amount > 1 && (
                <div className="bp-item-amount">x{reward.amount}</div>
              )}

              {isLocked && (
                <i
                  className="bi bi-lock-fill position-absolute top-0 end-0 m-1 text-white fs-5"
                  style={{ zIndex: 2 }}
                  title="Locked"
                />
              )}

              <img
                src={battlePassImageMap[reward.img]}
                alt=""
                loading="lazy"
                aria-hidden="true"
                className={imgClasses}
              />
              {isClaimed && (
                <i
                  className="bi bi-check-lg position-absolute top-50 start-50 translate-middle claimed-check-icon"
                  title="Claimed"
                />
              )}

              {isCurrentLevel && (
                <div
                  className="position-absolute start-0 bg-secondary rounded-bottom-5"
                  style={{
                    height: "6px",
                    zIndex: 0,
                    bottom: "0px",
                    width: "100%",
                  }}
                  title={`${xp} / ${level * 100} XP`}
                >
                  <div
                    className="bg-warning rounded-5"
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
