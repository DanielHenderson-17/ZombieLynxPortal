import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Title, Legend } from "chart.js";
import {
  getMyArkStats,
  getKDStatSummary,
} from "../../managers/arkStatsManager";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  getKDChartBackgroundData,
  getKDChartOverlayData,
  getKDChartOptions,
} from "../../utils/KDChartOptions";

ChartJS.register(ArcElement, Tooltip, Title, Legend, ChartDataLabels);

// ✅ Final needle plugin
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

    // Create orange–red gradient
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
  const [backgroundData, setBackgroundData] = useState(null);
  const [overlayData, setOverlayData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [kdValue, setKDValue] = useState(null);
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
          setBackgroundData(getKDChartBackgroundData());
          setOverlayData(getKDChartOverlayData());
          setChartOptions(getKDChartOptions(rawKD, maxKD));
        }
      }
    );
  }, []);

  if (!backgroundData || !overlayData || !chartOptions || kdValue === null)
    return null;

  return (
    <div className="" style={{ position: "relative", width: 320, height: 160 }}>
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
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        className="fs-2"
        style={{
          width: "20%",
          padding: "0",
          position: "absolute",
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        {kdValue}
      </div>
    </div>
  );
}
