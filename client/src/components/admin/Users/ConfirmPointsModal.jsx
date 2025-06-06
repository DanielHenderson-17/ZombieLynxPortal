import { formatDiscordName } from "../../../utils/formatDiscordName";

export default function ConfirmPointsModal({
  user,
  editedPoints,
  onConfirm,
  onClose,
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
          <div className="modal-header flex-column align-items-start mx-auto border-0 pb-0">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
              <img
                src={user.discordImgUrl}
                alt="Discord avatar"
                className="rounded-circle"
                style={{ width: "32px", height: "32px" }}
              />
              <strong>{formatDiscordName(user.discordName)}</strong>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center pt-0">
            <p className="mb-0">
              Are you sure you want to set their points to{" "}
              <strong>{editedPoints}</strong>?
            </p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
