export default function BattlePassXpBar({ xp }) {
  const currentLevel = Math.floor(xp / 100) + 1;
  const currentLevelStart = (currentLevel - 1) * 100;
  const nextLevelXp = currentLevel * 100;

  const xpIntoLevel = xp - currentLevelStart;
  const xpRemaining = nextLevelXp - xp;
  const progressPercent = (xpIntoLevel / 100) * 100;

  return (
    <div className="w-100 p-md-3 p-1 px-2 rounded text-white mt-md-5 mt-0 bp-xp-bar">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-uppercase text-white-50 small mb-1">
          Next Level:
        </span>
        <span className="text-warning small">{xpRemaining} XP</span>
      </div>

      <div className="progress" style={{ height: "5px" }}>
        <div
          className="progress-bar bg-warning"
          role="progressbar"
          style={{ width: `${progressPercent}%` }}
          aria-valuenow={xpIntoLevel}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <div className="text-end small fst-italic text-white-50 mt-1">
        ({Math.min(xp, 3000)} / 3000)
      </div>
    </div>
  );
}
