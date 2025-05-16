import { formatDiscordName } from "../../utils/formatDiscordName";

export default function EditPointsModal({
  user,
  editedPoints,
  setEditedPoints,
  onClose,
  onSave,
}) {
  if (!user) return null;

  return (
    <div
      className="modal fade show d-block responsive-modal"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header flex-column align-items-start border-0 pb-0">
            <div className="d-flex align-items-center justify-content-center w-100 gap-2 mt-2">
              <img
                src={user.discordImgUrl}
                alt="Discord avatar"
                className="rounded-circle"
                style={{ width: "32px", height: "32px" }}
              />
              <span>{formatDiscordName(user.discordName)}</span>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body text-center">
            <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
              <button
                className="btn btn-secondary"
                onClick={() => setEditedPoints((p) => Math.max(0, p - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="form-control text-center"
                style={{ maxWidth: "100px" }}
                value={editedPoints}
                onChange={(e) => setEditedPoints(parseInt(e.target.value) || 0)}
              />
              <button
                className="btn btn-secondary"
                onClick={() => setEditedPoints((p) => p + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
