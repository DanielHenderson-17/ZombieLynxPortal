export default function GeneralSettings() {
  return (
    <div className="pt-3">
      {/* 📝 Update Name (Placeholder for now) */}
      <section className="mb-5 text-start">
        <div className="row align-items-center mx-3 ">
          <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2">
            Profile Information
          </h4>
          <div className="col text-start ps-0">
            <label className="form-label fw-semibold mb-0">
              First Name and Last Name
            </label>
            <div className="text-secondary small">
              Manage your personal profile information here.
            </div>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-light" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* ❌ Deactivate Account */}
      <section className="mb-5">
        <div className="row align-items-center mx-3">
          <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2 text-danger">
            Deactivate Zombie Lynx Account
          </h4>
          <div className="col text-start ps-0">
            <label className="form-label fw-semibold mb-0 text-danger">
              Permanently deactivate your account
            </label>
            <div className="text-secondary small">
              This action is irreversible and will remove all your data.
            </div>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-danger">Deactivate</button>
          </div>
        </div>
      </section>
    </div>
  );
}
