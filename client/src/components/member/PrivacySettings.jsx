// components/settings/PrivacySettings.jsx
import { useEffect, useState } from "react";
import {
  getUserProfiles,
  updateMarketingConsent,
} from "../../managers/userProfileManager";

export default function PrivacySettings() {
  const [allowMarketingEmails, setAllowMarketingEmails] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserProfiles()
      .then((data) => {
        setAllowMarketingEmails(data.allowMarketingEmails);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleToggle = async () => {
    const newValue = !allowMarketingEmails;
    setAllowMarketingEmails(newValue);
    setSaving(true);
    try {
      await updateMarketingConsent(newValue);
    } catch (err) {
      console.error(err);
      setError("Failed to update preferences.");
      setAllowMarketingEmails(!newValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-3">
      {/* 📧 Marketing Preferences */}
      <section className="mb-5 text-start">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row align-items-center mx-3">
              <h4 className="settings-section-header text-start mb-2 border-bottom border-secondary ps-0 pb-2">
                Marketing Preferences
              </h4>
              <div className="col text-start ps-0">
                <label
                  htmlFor="marketingToggle"
                  className="form-label fw-semibold mb-0"
                >
                  Allow marketing and promotional emails
                </label>
                <div className="text-secondary small">
                  You will still receive important emails about your account and
                  purchases.
                </div>
              </div>
              <div className="col-auto">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="marketingToggle"
                    checked={allowMarketingEmails}
                    onChange={handleToggle}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-danger mt-2">{error}</p>}
          </>
        )}
      </section>
    </div>
  );
}
