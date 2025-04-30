// components/settings/LinkedAccountsSettings.jsx
export default function LinkedAccountsSettings() {
  return (
    <div className="pt-3">
      {/* 🔗 Linked Accounts */}
      <section className="mb-5 text-start">
        <div className="row align-items-center mx-3">
          <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2">
            Linked Accounts
          </h4>
          <div className="col text-start ps-0">
            <label className="form-label fw-semibold mb-0">
              Manage connected platforms
            </label>
            <div className="text-secondary small">
              Steam, Discord, Minecraft, and others can be linked here.
            </div>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-light" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
