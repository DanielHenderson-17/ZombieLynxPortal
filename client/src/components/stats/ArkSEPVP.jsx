import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Title, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  getMyArkStats,
  getKDStatSummary,
} from "../../managers/arkStatsManager";

import {
  getKDChartBackgroundData,
  getKDChartOverlayData,
  getKDChartOptions,
} from "../../utils/ASEKDChartOptions";

import "./Stats.css";

ChartJS.register(ArcElement, Tooltip, Title, Legend, ChartDataLabels);

// ✅ Needle plugin
ChartJS.register({
  id: "needle",
  afterDatasetDraw(chart, args, pluginOptions) {
    if (chart.canvas.id !== "kd-overlay") return;

    const value = Math.max(0, Math.min(pluginOptions.value, 6));
    const angleFraction = value / 6;
    const angleDeg = 180 - angleFraction * 180;
    const angle = angleDeg * (Math.PI / 180);

    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const cx = meta.data[0].x;
    const cy = meta.data[0].y;
    const r = meta.data[0].outerRadius;

    const needleLength = r * 0.75;
    const needleWidth = 6;

    ctx.save();
    ctx.translate(cx, cy - 10);
    ctx.scale(-1, 1);
    ctx.rotate(angle);

    const gradient = ctx.createLinearGradient(-needleLength, 0, 0, 0);
    gradient.addColorStop(0, "#dc3545");
    gradient.addColorStop(1, "#fd7e14");

    ctx.beginPath();
    ctx.moveTo(-needleLength, 0);
    ctx.lineTo(0, -needleWidth / 2);
    ctx.lineTo(0, needleWidth / 2);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  },
});

export default function ArkSEPVP() {
  const canvasRef = useRef(null);
  const [backgroundData, setBackgroundData] = useState(null);
  const [overlayData, setOverlayData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [kdValue, setKDValue] = useState(null);
  const [stats, setStats] = useState(null);
  const [clampedKD, setClampedKD] = useState(null);

  useEffect(() => {
    Promise.all([getMyArkStats(), getKDStatSummary()]).then(
      ([stats, summary]) => {
        if (stats && summary) {
          const maxKD = Math.max(6, Math.ceil(summary.maxKD));
          const rawKD = parseFloat(stats.kd ?? 0);
          const clamped = Math.min(6, rawKD);

          setKDValue(rawKD);
          setClampedKD(clamped);
          setOverlayData(getKDChartOverlayData());
          setChartOptions(getKDChartOptions(rawKD, maxKD));
          setStats(stats);

          // ✅ Generate backgroundData once canvas is available
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              setBackgroundData(getKDChartBackgroundData(ctx));
            }
          }, 0);
        }
      }
    );
  }, []);

  if (!backgroundData || !overlayData || !chartOptions || kdValue === null)
    return <canvas ref={canvasRef} className="d-none" />;

  return (
    <div className="chart-shell position-relative">
      {/* Base Gradient Chart */}
      <Doughnut
        data={backgroundData}
        options={{
          ...chartOptions,
          plugins: { ...chartOptions.plugins, needle: undefined },
        }}
      />

      {/* Overlay Needle Chart */}
      <Doughnut
        id="kd-overlay"
        data={overlayData}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            needle: { value: clampedKD },
          },
        }}
        className="position-absolute top-0 start-0 w-100 h-100"
      />

      {/* Center K/D Label */}
      <div
        className="position-absolute text-white fw-bold"
        style={{
          top: "92%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.7rem",
          textShadow:
            "-1px -1px 0 #444, 1px -1px 0 #444, -1px 1px 0 #444, 1px 1px 0 #444",
        }}
      >
        K/D: <span>{kdValue}</span>
      </div>

      {/* Stat Block */}
      <div className="kd-chart-stats d-flex justify-content-around text-white text-center w-100">
        <div className="stat-block d-flex flex-column align-items-center">
          <span className="stat-label">Kills</span>
          <span className="stat-value">{stats?.playerKills ?? 0}</span>
        </div>
        <div className="stat-block d-flex flex-column align-items-center">
          <span className="stat-label">PvP Damage</span>
          <span className="stat-value">{stats?.pvPDamage ?? 0}</span>
        </div>
        <div className="stat-block d-flex flex-column align-items-center">
          <span className="stat-label">Deaths</span>
          <span className="stat-value">{stats?.playerDeaths ?? 0}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="kd-chart-legend position-absolute start-0 w-100 px-2 text-white small d-flex justify-content-center gap-3">
        {[
          { label: "Poor", color: "#7a032a" },
          { label: "Average", color: "#6b0dac" },
          { label: "Above Avg", color: "#443a8b" },
          { label: "Excellent", color: "#1b178b" },
        ].map((item) => (
          <div key={item.label} className="d-flex align-items-center gap-1">
            <div
              className="legend-box"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
