import { useEffect, useState } from "react";
import smokeBg from "../../assets/battlepass/smoke-bg.webm";
import "./BattlePass.css";
import BattlePassItems from "./BattlePassItems";
import BattlePassSingleItem from "./BattlePassSingleItem";
import BattlePassXpBar from "./BattlePassXpBar";
import BattlePassButtons from "./BattlePassButtons";
import { getMyBattlePass } from "../../managers/battlePassManager";
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
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showComingSoon) return;

    getMyBattlePass().then((data) => {
      if (!data) return;

      const daysLeft = getDaysLeft(data.end);
      if (daysLeft <= 0) {
        setShowComingSoon(true);
        return;
      }

      setBattlePassData(data);

      const firstReward = data.rewards?.[1];
      if (firstReward) {
        setSelectedItem(firstReward);
      }
    });
  }, [showComingSoon]);

  if (isMobile) {
    return (
      <div className="text-center py-5 text-white">
        <h4>This feature is not yet optimized for Mobile.</h4>
        <p>Please try again on a PC.</p>
      </div>
    );
  }

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
      <div className="flex-grow-1 mb-0 bp-main py-md-4 py-0 pt-1 px-md-5 px-2 ">
        <video
          className="bp-background-img d-none d-md-block"
          src={smokeBg}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="battlepass-items">
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
        <div className="battlepass-premium-card">
          <BattlePassPremiumCard
            hasPremium={battlePassData.hasPremium}
            premiumImage={premiumImage}
          />
        </div>
        <div className="battlepass-xp-bar">
          <BattlePassXpBar xp={battlePassData.xp} />
        </div>

        <div className="battlepass-buttons mb-md-4 mb-0 pb-md-2 pb-0">
          <BattlePassButtons
            claimableLevels={battlePassData.claimableLevels}
            rewards={battlePassData.rewards}
            setBattlePassData={setBattlePassData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="battlepass-single-item-details d-none d-md-block">
          {selectedItem && (
            <BattlePassSingleItemDetails selectedItem={selectedItem} />
          )}
        </div>
        <div className="battlepass-single-item mb-md-3 mb-0">
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
