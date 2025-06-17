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
      className={`stats-container fade-container container-fluid ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="row py-4">
        {/* ✅ Left 2/3: 2x2 Grid of ArkSEKD */}
        <div className="col-md-8 col-12">
          <div className="row g-3">
            <div className="col-md-6 col-12">
              <div className="bg-dark border rounded p-5">
                <ArkSEKD />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="bg-dark border rounded p-5">
                <ArkSEKD />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="bg-dark border rounded p-5">
                <ArkSEKD />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="bg-dark border rounded p-5">
                <ArkSEKD />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Right 1/3: PvP board */}
        <div className="col-md-4 col-12 mt-3 mt-md-0">
          <div className="bg-dark border rounded p-3 h-100 d-flex justify-content-center align-items-center">
            <h4 className="text-white text-center">PvP Board (Placeholder)</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
