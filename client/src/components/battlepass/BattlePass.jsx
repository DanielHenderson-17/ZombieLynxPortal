import { useEffect, useState } from "react";
import bpBackground from "../../assets/battlepass/BP_bg.webp";
import "./BattlePass.css";
import BattlePassItems from "./BattlePassItems";
import BattlePassSingleItem from "./BattlePassSingleItem";
import { getMyBattlePass } from "../../managers/battlePassManager";
import BattlePassSingleItemDetails from "./BattlePassSingleItemDetails";
import BattlePassPremiumCard from "./BattlePassPremiumCard";

export default function BattlePass() {
  const [isVisible, setIsVisible] = useState(false);
  const [battlePassData, setBattlePassData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getMyBattlePass().then((data) => {
      setBattlePassData(data);
    });
  }, []);

  if (!battlePassData) return null;

  return (
    <div
      className={`position-relative d-flex flex-column flex-lg-row fade-container ticket-container text-white ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      {/* <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0 position-relative">
        <p className="text-secondary mb-2">Battle Pass</p>
      </div> */}

      <div className="flex-grow-1 mb-0 bp-main p-5">
        <img
          src={bpBackground}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="bp-background-img"
        />

        <div className="div1">
          <BattlePassItems
            xp={battlePassData.xp}
            claimedLevels={battlePassData.claimedLevels}
            claimableLevels={battlePassData.claimableLevels}
            rewards={battlePassData.rewards}
            onSelect={setSelectedItem}
          />
        </div>
        <div className="div2">
          <BattlePassPremiumCard
            hasPremium={battlePassData.hasPremium}
            premiumImage={battlePassData.img}
          />
        </div>
        <div className="div3 mb-4 pb-2">
          <div className="h-50 d-flex align-items-center justify-content-end p-0 m-0 pt-3">
            <div className="w-50 d-flex justify-content- align-items-center border border-black rounded bp-premium-gradient">
              <button className="btn btn-outline text-end text-black w-100 fs-6 fw-bold">
                BUY LEVELS
              </button>
              <i className="bi bi-plus-circle mx-3 text-black fs-5 fw-bold"></i>
            </div>
          </div>
          <div className="text-end h-50 w-50 d-flex align-items-center ms-auto justify-content-end mt-3">
            <div className="diamond border border-black bg-dark shadow">
              <span>1</span>
            </div>
            <div className="border border-3 border-secondary bp-bar"></div>
            <div className="diamond border border-black bg-dark shadow">
              <span>2</span>
            </div>
            <div className="border border-3 border-secondary bp-bar"></div>
            <div className="diamond border border-black bg-dark shadow">
              <span>3</span>
            </div>
            <div className="border border-3 border-secondary bp-bar"></div>
            <div className="diamond border border-black bg-dark shadow">
              <span>4</span>
            </div>
            <div className="border border-3 border-secondary bp-bar"></div>
            <div className="diamond border border-black bg-dark shadow">
              <span>5</span>
            </div>
          </div>
        </div>

        <div className="div4">
          {selectedItem && (
            <BattlePassSingleItemDetails selectedItem={selectedItem} />
          )}
        </div>
        <div className="div5 mb-3">
          {selectedItem && <BattlePassSingleItem reward={selectedItem} />}
        </div>
      </div>
    </div>
  );
}
