import { useEffect, useState } from "react";
import smokeBg from "../../assets/battlepass/smoke-bg.webm";
import "./BattlePass.css";
import BattlePassItems from "./BattlePassItems";
import BattlePassSingleItem from "./BattlePassSingleItem";
import BattlePassXpBar from "./BattlePassXpBar";
import {
  getMyBattlePass,
  claimAllBattlePassRewards,
} from "../../managers/battlePassManager";
import BattlePassSingleItemDetails from "./BattlePassSingleItemDetails";
import BattlePassPremiumCard from "./BattlePassPremiumCard";
import { battlePassImageMap } from "../../utils/battlePassImageMap";
import { claimBattlePassLevel } from "../../managers/battlePassManager";
import { getDaysLeft } from "../../utils/getDaysLeft";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BattlePass() {
  const [isVisible, setIsVisible] = useState(false);
  const [battlePassData, setBattlePassData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  console.log(selectedItem);

  // TEMPORARY: Set to true to show the "Coming Soon" message
  const showComingSoon = true;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showComingSoon) return;

    getMyBattlePass().then((data) => {
      setBattlePassData(data);

      const firstReward = data?.rewards?.[1];
      if (firstReward) {
        setSelectedItem(firstReward);
      }
    });
  }, [showComingSoon]);

  if (showComingSoon || !battlePassData) {
    return (
      <div className="text-center py-5 text-white">
        <h2>Battle Pass Coming Soon!</h2>
      </div>
    );
  }

  const premiumImage = battlePassImageMap["season_of_shadows"];

  return (
    <div
      className={`position-relative d-flex flex-column flex-lg-row fade-container ticket-container text-white ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="flex-grow-1 mb-0 bp-main py-4 px-5">
        <video
          className="bp-background-img"
          src={smokeBg}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="div1">
          <BattlePassItems
            xp={battlePassData.xp}
            claimedLevels={battlePassData.claimedLevels}
            claimableLevels={battlePassData.claimableLevels}
            rewards={battlePassData.rewards}
            onSelect={setSelectedItem}
            selectedItem={selectedItem}
            activeTab={activeTab}
          />
        </div>
        <div className="div2">
          <BattlePassPremiumCard
            hasPremium={battlePassData.hasPremium}
            premiumImage={premiumImage}
          />
        </div>
        <div className="div6">
          <BattlePassXpBar xp={battlePassData.xp} />
        </div>

        <div className="div3 mb-4 pb-2">
          <div className="h-50 d-flex align-items-center justify-content-end p-0 m-0 pt-3">
            <div className="w-100 d-flex gap-1 align-items-center justify-content-end h-100">
              {battlePassData.claimableLevels.length > 0 && (
                <div
                  className="d-flex align-items-center border border-black rounded bg-success px-3 py-1 claim-all-button h-100"
                  role="button"
                  onClick={async () => {
                    const result = await claimAllBattlePassRewards();

                    if (result?.claimedLevels?.length) {
                      const claimedIds = result.claimedLevels
                        .map((lvl) => battlePassData.rewards[lvl]?.id)
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
                  }}
                >
                  <i className="bi bi-files text-white"></i>
                  <span className="claim-all-text text-white fw-bold d-none ms-2">
                    Claim All
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-end align-items-center border border-black rounded bp-premium-gradient px-3 py-1 h-100">
                <button className="btn btn-outline text-end text-black w-100 fs-6 fw-bold">
                  BUY LEVELS
                </button>
                <i className="bi bi-plus-circle mx-3 text-black fs-5 fw-bold"></i>
              </div>
            </div>
          </div>

          <div className="text-end h-50 w-50 d-flex align-items-center ms-auto justify-content-end mt-3">
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

        <div className="div4">
          {selectedItem && (
            <BattlePassSingleItemDetails selectedItem={selectedItem} />
          )}
        </div>
        <div className="div5 mb-3">
          <p className="mb-0 text-white">
            Ends in: {getDaysLeft(battlePassData.end)} Day(s)
          </p>
          <h2 className="bp-premium-gradient-text rounded-2 mx-auto mb-0">
            {battlePassData.name.toUpperCase()}
          </h2>
          {selectedItem && (
            <BattlePassSingleItem
              reward={selectedItem}
              level={Object.keys(battlePassData.rewards).find(
                (key) => battlePassData.rewards[key] === selectedItem
              )}
              claimableLevels={battlePassData.claimableLevels}
              claimedLevels={battlePassData.claimedLevels}
              onClaim={async (level) => {
                try {
                  const result = await claimBattlePassLevel(level);
                  if (result) {
                    toast.success(`🎉 Claimed ${selectedItem.id}!`);
                    const refreshed = await getMyBattlePass();
                    if (refreshed) setBattlePassData(refreshed);
                  } else {
                    toast.error(`❌ Failed to claim ${selectedItem.id}.`);
                  }
                } catch (err) {
                  toast.error(`🚫 Error claiming reward: ${err.message}`);
                }
              }}
            />
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={6000}
        style={{ zIndex: "10000" }}
      />
    </div>
  );
}
