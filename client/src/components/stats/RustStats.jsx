import { useEffect, useState } from "react";
import "./Stats.css";

export default function RustStats() {
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
      <h1 className="pt-md-5 pt-2 text-secondary">Rust Stats Coming Soon!</h1>
    </div>
  );
}
