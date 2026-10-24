import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceOfflineNotice.css";

export default function ServiceOfflineNotice() {
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const returnHome = () => navigate("/", { replace: true });

  return (
    <dialog
      ref={dialogRef}
      className="service-offline-dialog"
      aria-labelledby="service-offline-title"
      aria-describedby="service-offline-description"
      onCancel={(event) => {
        event.preventDefault();
        returnHome();
      }}
    >
      <h2 id="service-offline-title">Service offline</h2>
      <p id="service-offline-description">
        Account login and registration are currently unavailable.
      </p>
      <button type="button" onClick={returnHome} autoFocus>
        Back to homepage
      </button>
    </dialog>
  );
}
