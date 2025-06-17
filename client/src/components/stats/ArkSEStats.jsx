import { useEffect, useState } from "react";
import "./Stats.css";
import ArkSEKD from "./ArkSEKD";

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
      <div className="pt-md-5 pt-2 text-center text-secondary">
        <h1 className="mb-4">Ark:SE Stats</h1>
        <ArkSEKD />
      </div>
    </div>
  );
}
