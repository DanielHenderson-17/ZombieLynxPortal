import { useState } from "react";
import { bulkEditPoints } from "../../managers/userProfileManager";
import { formatDiscordName } from "../../utils/formatDiscordName";

export default function BulkEditPointsModal({
  selectedUsers,
  onClose,
  onSuccess,
}) {
  const [pointDelta, setPointDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!pointDelta || selectedUsers.length === 0) return;

    setIsSubmitting(true);

    const edits = selectedUsers.map((user) => ({
      userProfileId: user.userProfileId,
      oldPoints: user.points,
      points: user.points + pointDelta,
    }));

    try {
      const result = await bulkEditPoints(edits);
      onSuccess(result);
    } catch (error) {
      alert("Bulk point update failed.", error.message || error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block responsive-modal"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header flex-column align-items-start border-0 pb-0">
            <h5 className="modal-title w-100 text-center">Bulk Edit Points</h5>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body text-center">
            <p className="mb-2">
              Adjusting <strong>{selectedUsers.length}</strong> user
              {selectedUsers.length > 1 ? "s" : ""}:
            </p>

            <div
              className="mb-3"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            >
              {selectedUsers.map((u) => (
                <div
                  key={u.userProfileId}
                  className="d-flex align-items-center justify-content-center gap-2 mb-1"
                >
                  <img
                    src={u.discordImgUrl}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span className="small">
                    {formatDiscordName(u.discordName)} (Current: {u.points})
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-center align-items-center gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setPointDelta((p) => p - 1)}
              >
                −
              </button>
              <input
                type="number"
                className="form-control text-center"
                style={{ maxWidth: "100px" }}
                value={pointDelta}
                onChange={(e) => setPointDelta(parseInt(e.target.value) || 0)}
              />
              <button
                className="btn btn-secondary"
                onClick={() => setPointDelta((p) => p + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
