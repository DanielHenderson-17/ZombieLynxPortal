export default function UserFilterBar({
  platformFilter,
  setPlatformFilter,
  isBulkMode,
  hasSelections,
  onBulkEditClick,
}) {
  const platforms = ["Steam", "Minecraft", "Epic"];

  return (
    <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
      {/* Platform filter buttons */}
      {platforms.map((platform) => (
        <button
          key={platform}
          className={`btn btn-sm ${
            platformFilter === platform
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() =>
            setPlatformFilter((prev) => (prev === platform ? null : platform))
          }
        >
          {platform}
        </button>
      ))}

      <button
        className={`btn btn-sm ${
          platformFilter === null ? "btn-primary" : "btn-outline-secondary"
        }`}
        onClick={() => setPlatformFilter(null)}
      >
        All
      </button>

      {/* Edit Points button */}
      {isBulkMode && hasSelections && (
        <button
          className="btn btn-success btn-sm ms-auto"
          onClick={onBulkEditClick}
        >
          Edit Points for Selected
        </button>
      )}
    </div>
  );
}
