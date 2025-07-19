import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  claimAllBattlePassRewards,
  getMyBattlePass,
} from "../../managers/battlePassManager";

export default function BattlePassButtons({
  claimableLevels,
  rewards,
  setBattlePassData,
  activeTab,
  setActiveTab,
}) {
  const handleClaimAll = async () => {
    const result = await claimAllBattlePassRewards();

    if (result?.claimedLevels?.length) {
      const claimedIds = result.claimedLevels
        .map((lvl) => rewards[lvl]?.id)
        .filter(Boolean);

      claimedIds.forEach((id) => {
        toast.success(`🎉 Claimed ${id}`, {
          position: "bottom-right",
          autoClose: 4000,
        });
      });

      const refreshed = await getMyBattlePass();
      if (refreshed) setBattlePassData(refreshed);
    } else {
      toast.info("No rewards to claim.");
    }
  };

  return (
    <div className="div3 mb-md-4 mb-0 pb-md-2 pb-1">
      <div className="h-50 d-flex align-items-center justify-content-end p-0 m-0 pt-md-3 pt-0">
        <div className="w-100 d-flex gap-1 align-items-center justify-content-end h-100">
          {claimableLevels.length > 0 && (
            <div
              className="d-flex align-items-center border border-black rounded bg-success px-3 py-1 claim-all-button h-100"
              role="button"
              onClick={handleClaimAll}
            >
              <i className="bi bi-files text-white"></i>
              <span className="claim-all-text text-white fw-bold d-none ms-2">
                Claim All
              </span>
            </div>
          )}

          <div className="d-flex justify-content-end align-items-center border border-black rounded bp-premium-gradient px-3 py-1 h-100">
            <Link
              to="/shop"
              className="text-decoration-none d-flex align-items-center text-black fw-bold justify-content-end"
            >
              <p className="m-0"> BUY LEVELS</p>
              <i className="bi bi-plus-circle ms-3 text-black fs-5 fw-bold"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-end h-50 w-50 d-flex align-items-center ms-auto justify-content-end mt-md-3 mt-4">
        {[1, 2, 3].map((tab, index) => (
          <div key={tab} className="d-flex align-items-center">
            <div
              className={`diamond border shadow ${
                activeTab === tab
                  ? "tab-purple-gradient"
                  : "bg-dark text-white border-black"
              }`}
              role="button"
              onClick={() => setActiveTab(tab)}
              style={{ cursor: "pointer" }}
            >
              <span>{tab}</span>
            </div>

            {index < 2 && (
              <div className="border border-3 border-secondary bp-bar"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
