import { useEffect, useState } from "react";
import "./Stats.css";

export default function ArkSEStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`stats-container fade-container d-md-flex d-block justify-content-center align-items-center ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <img src="/images/Kibo.png" alt="" className="kibo" />
      <h1 className="pt-md-5 pt-2 text-secondary">Ark:SE Stats Coming Soon!</h1>
    </div>
  );
}
