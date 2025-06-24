import steamIcon from "../../../assets/admin/steamIcon.webp";
import minecraftIcon from "../../../assets/admin/minecraftIcon.webp";
import epicIcon from "../../../assets/admin/epicIcon.webp";

export default function UserFilterBar({
  platformFilter,
  setPlatformFilter,
  isBulkMode,
  hasSelections,
  onBulkEditClick,
}) {
  const platforms = [
    { name: "Steam", icon: steamIcon },
    { name: "Minecraft", icon: minecraftIcon },
    { name: "Epic", icon: epicIcon },
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-0 align-items-center mx-1 user-filter-bar">
      {/* Platform filter buttons */}
      {platforms.map(({ name, icon }) => (
        <button
          key={name}
          className={`btn btn-sm d-flex align-items-center gap-2 ${
            platformFilter === name ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() =>
            setPlatformFilter((prev) => (prev === name ? null : name))
          }
        >
          <img
            src={icon}
            alt=""
            loading="lazy"
            aria-hidden="true"
            width="20"
            height="20"
            style={{ objectFit: "contain" }}
          />

          <span className="d-none d-md-inline">{name}</span>
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
          Edit Points
        </button>
      )}
    </div>
  );
}
