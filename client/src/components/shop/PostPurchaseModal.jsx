// src/components/cart/PostPurchaseModal.jsx
export default function PostPurchaseModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Thank You for Your Purchase!</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              In order to use your points, your account must be connected to a
              game!
            </p>

            <a
              href="/member/accountsettings?tab=Accounts"
              className="text-info text-decoration-underline"
            >
              Account Settings
            </a>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
