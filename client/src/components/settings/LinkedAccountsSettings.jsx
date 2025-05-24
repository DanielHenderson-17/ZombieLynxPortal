import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  linkSteamAccount,
  unlinkSteamAccount,
  getLinkedSteamAccount,
  getMainJwtToken,
} from "../../managers/steamAuthManager";
import {
  getLinkedMinecraftAccount,
  unlinkMinecraftAccount,
  openMinecraftAuthWindow,
} from "../../managers/minecraftAuthManager";
import {
  getLinkedEpicAccount,
  unlinkEpicAccount,
  openEpicAuthWindow,
} from "../../managers/epicAuthManager";

export default function LinkedAccountsSettings() {
  const [, setSteamAccount] = useState(null);
  const [, setMinecraftAccount] = useState(null);
  const [, setEpicAccount] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [platformToUnlink, setPlatformToUnlink] = useState(null);

  const availableAccounts = [
    { name: "Epic", icon: "/epicIcon.png" },
    { name: "Steam", icon: "/steamIcon.png" },
    { name: "Minecraft", icon: "/minecraftIcon.png" },
  ];

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (!getMainJwtToken()) return;

      setLoading(true);
      try {
        const steamData = await getLinkedSteamAccount();
        const minecraftData = await getLinkedMinecraftAccount();
        const epicData = await getLinkedEpicAccount();

        const linked = [];

        if (steamData?.steamId) {
          linked.push({ name: "Steam", ...steamData });
          setSteamAccount(steamData);
        }

        if (minecraftData?.minecraftUuid) {
          linked.push({ name: "Minecraft", ...minecraftData });
          setMinecraftAccount(minecraftData);
        }

        if (epicData?.eosId) {
          linked.push({ name: "Epic", ...epicData });
          setEpicAccount(epicData);
        }
        console.log("Linked Accounts:", linked);

        setLinkedAccounts(linked);
      } catch (err) {
        console.error("Failed to load linked accounts.", err);
        setError("Failed to load linked accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedAccounts();
  }, [refreshTrigger]);

  const handleLinkAccount = (platform) => {
    if (!getMainJwtToken()) {
      toast.error("Please log in to link your account.");
      return;
    }

    setLoading(true);

    if (platform === "Steam") {
      linkSteamAccount(() => {
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platform === "Minecraft") {
      openMinecraftAuthWindow();
      setTimeout(() => setRefreshTrigger((prev) => !prev), 5000);
      setLoading(false);
    } else if (platform === "Epic") {
      openEpicAuthWindow();
      setTimeout(() => setRefreshTrigger((prev) => !prev), 5000);
      setLoading(false);
    }
  };

  const handleUnlinkAccount = (platform) => {
    setPlatformToUnlink(platform);
    setShowModal(true);
  };

  const confirmUnlink = () => {
    setLoading(true);
    setShowModal(false);

    if (platformToUnlink === "Steam") {
      unlinkSteamAccount(() => {
        setSteamAccount(null);
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platformToUnlink === "Minecraft") {
      unlinkMinecraftAccount(() => {
        setMinecraftAccount(null);
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    } else if (platformToUnlink === "Epic") {
      unlinkEpicAccount(() => {
        setEpicAccount(null);
        setRefreshTrigger((prev) => !prev);
        setLoading(false);
      });
    }
  };

  return (
    <div className="pt-3">
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
              Steam, Minecraft, and Epic can be linked here.
            </div>
          </div>
        </div>

        <div className="row mt-4 mx-3">
          {linkedAccounts.length > 0 && (
            <div className="col-12 mb-4">
              <p className="text-white mb-2">
                <i className="bi bi-link-45deg me-1"></i> Linked Accounts
              </p>
              {linkedAccounts.map((acc) => (
                <div
                  key={acc.name}
                  className="d-flex align-items-center justify-content-between linked-back rounded mb-2 p-2"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        availableAccounts.find((a) => a.name === acc.name)?.icon
                      }
                      alt={`${acc.name} Icon`}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span className="text-white fw-semibold">
                      {acc.name === "Steam"
                        ? acc.steamName
                        : acc.name === "Minecraft"
                        ? acc.minecraftUsername
                        : acc.name === "Epic"
                        ? acc.epicName
                        : acc.name}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleUnlinkAccount(acc.name)}
                    disabled={loading}
                  >
                    Unlink
                  </button>
                </div>
              ))}
            </div>
          )}

          {availableAccounts.some(
            (acc) => !linkedAccounts.some((linked) => linked.name === acc.name)
          ) && (
            <div className="col-12">
              <p className="text-white mb-2">
                <i className="bi bi-plus-lg me-1"></i> Link a New Account
              </p>
              <div className="d-flex gap-3">
                {availableAccounts
                  .filter(
                    (acc) =>
                      !linkedAccounts.some((linked) => linked.name === acc.name)
                  )
                  .map((acc) => (
                    <button
                      key={acc.name}
                      className="btn btn-outline-secondary text-white d-flex align-items-center gap-2"
                      onClick={() => handleLinkAccount(acc.name)}
                      disabled={loading}
                    >
                      <img
                        src={acc.icon}
                        alt={`${acc.name} Icon`}
                        style={{ width: "20px", height: "20px" }}
                      />
                      {acc.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {error && <p className="text-danger text-center">{error}</p>}
      <ToastContainer position="top-center" autoClose={4000} />
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure?</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Unlinking this {platformToUnlink} account means it will no
                  longer be eligible to add points to the ZLG Portal — even if
                  linked again to this or another account.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmUnlink}
                >
                  Yes, Unlink
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
