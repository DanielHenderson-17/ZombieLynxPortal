import { useState, useEffect } from "react";
import {
  updateAccount,
  tryGetLoggedInUser,
  deactivateAccount,
  logout,
} from "../../managers/authManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    tryGetLoggedInUser()
      .then((user) => {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }));
        setOriginalData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        });
      })
      .catch(() => setStatus("Failed to load user info"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    const {
      firstName,
      lastName,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = formData;
    const nameChanged =
      firstName !== originalData.firstName ||
      lastName !== originalData.lastName;
    const passwordFieldsFilled =
      currentPassword || newPassword || confirmNewPassword;
    return nameChanged || passwordFieldsFilled;
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateAccount(formData);
      toast.success("Changes saved.");
      setOriginalData({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (err) {
      toast.error(err.message || "Failed to update account.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateAccount();
      await logout();
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message || "Failed to deactivate account.");
    }
  };

  return (
    <div className="pt-3 general-main">
      <section className="mb-5 text-start">
        <div className="row align-items-center mx-3">
          <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2">
            Profile Information
          </h4>
        </div>
        <div className="d-flex justify-content-between flex-wrap mx-0">
          {/* Name */}
          <div className="name col-6 text-start mt-2">
            {/* FirstName */}
            <div className="mb-3 mx-3 d-md-flex d-block align-items-center">
              <label className="form-label col-md-3 col-12 m-md-0 mb-1">
                First Name
              </label>
              <input
                className="form-control col"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            {/* Last Name */}
            <div className="mb-3 mx-3 d-md-flex d-block align-items-center">
              <label className="form-label col-md-3 col-12 m-md-0 mb-1">
                Last Name
              </label>
              <input
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="password col-6 text-start mt-2">
            <div className="mb-3 mx-3 d-md-flex d-block align-items-center">
              <label className="form-label col-md-4 col-12 m-md-0 mb-1">
                Current Password
              </label>
              <input
                className="form-control"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 mx-3 d-md-flex d-block align-items-center">
              <label className="form-label col-md-4 col-12 m-md-0 mb-1">
                New Password
              </label>
              <input
                className="form-control"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 mx-3 d-md-flex d-block align-items-center">
              <label className="form-label col-md-4 col-12 m-md-0 mb-1">
                Confirm Password
              </label>
              <input
                className="form-control"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {status && (
          <div className="mx-3 text-secondary small mt-1">{status}</div>
        )}

        <div className="mx-3 mt-1 d-flex justify-content-end">
          <button
            className="btn btn-success"
            disabled={!hasChanges() || saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
      {/* ❌ Deactivate Account */}
      <section className="mb-5 pb-5 px-md-0 px-2">
        <div className="row align-items-center mx-md-3 mx-2 pb-5">
          <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2 text-danger">
            Deactivate Zombie Lynx Account
          </h4>
          <div className="col text-start ps-0">
            <label className="form-label fw-semibold mb-0 text-danger">
              Permanently deactivate your account
            </label>
            <div className="text-secondary small">
              This action will remove your account and all associated game
              accounts. You will not be able to log in again unless you register
              a new account.
            </div>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-outline-danger"
              onClick={() => setShowDeactivateModal(true)}
            >
              Deactivate
            </button>
          </div>
        </div>
      </section>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
      />
      {showDeactivateModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure?</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowDeactivateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Deactivating your account will unlink all associated game
                  accounts and prevent future logins.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeactivateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeactivate}
                >
                  Yes, Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
