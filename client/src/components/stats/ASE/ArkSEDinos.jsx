import { useEffect, useState } from "react";
import { getMyArkStats } from "../../../managers/arkStatsManager";
import { getArkDinoImages } from "../../../utils/ASEDinoImages";

export default function ArkSEDinos() {
  const [stats, setStats] = useState(null);
  const images = getArkDinoImages();

  useEffect(() => {
    getMyArkStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-white text-center">Loading...</div>;

  const cards = [
    {
      label: "Boss Kills",
      value: stats.bossKills,
      img: images.broodmotherTrophy,
    },
    { label: "Dinos Tamed", value: stats.tamedDinos, img: images.bola },
    { label: "Alpha Kills", value: stats.alphaKills, img: images.alphaTooth },
    { label: "Dinos Killed", value: stats.wildDinoKills, img: images.shotgun },
    { label: "Fiber Harvest", value: stats.fiberHarvest, img: images.fiber },
    { label: "Fish Caught", value: stats.fishCaught, img: images.fishingRod },
    { label: "Quests Total", value: stats.questsCompleted, img: images.note },
    {
      label: "Daily Quests",
      value: stats.dailyQuestsCompleted,
      img: images.calendarDate,
    },
    {
      label: "Weekly Quests",
      value: stats.weeklyQuestsCompleted,
      img: images.calendarMonth,
    },
  ];

  return (
    <div className="row row-cols-3 g-2 align-items-center h-100 pt-1">
      {cards.map((card, idx) => (
        <div key={idx} className="col">
          <div className="dino-card rounded d-flex align-items-center py-2 px-3 gap-3 h-100 w-100 shadow-sm">
            <img
              src={card.img}
              alt={card.label}
              style={{ width: 32, height: 32 }}
              loading="lazy"
              aria-hidden="true"
            />
            <div className="d-flex flex-column align-items-start">
              <div className="fs-5 fw-bold text-white">{card.value}</div>
              <div className="text-secondary extra-small">{card.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
