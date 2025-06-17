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
} from "../../utils/KDChartOptions";

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

export default function ArkSEKD() {
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
    <div className="kd-chart-wrapper">
      <Doughnut
        data={backgroundData}
        options={{
          ...chartOptions,
          plugins: { ...chartOptions.plugins, needle: undefined },
        }}
      />
      <Doughnut
        id="kd-overlay"
        data={overlayData}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            needle: {
              value: clampedKD,
            },
          },
        }}
        className="kd-chart-overlay"
      />
      <div className="kd-chart-label w-100">
        K/D: <span className="d-inline">{kdValue}</span>
      </div>

      {/* ✅ Legend inside chart wrapper */}
      <div className="kd-chart-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#5a0000" }} />
          <span>Poor</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#ff6600" }} />
          <span>Average</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#ffcc00" }} />
          <span>Above Avg</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#33cc33" }} />
          <span>Excellent</span>
        </div>
      </div>
      {/* ✅ Top-right stat block */}
      <div className="kd-chart-stats">
        <div>Kills: {stats?.playerKills ?? 0}</div>
        <div>Deaths: {stats?.playerDeaths ?? 0}</div>
        <div>PvP Damage: {stats?.pvPDamage ?? 0}</div>
      </div>
    </div>
  );
}
