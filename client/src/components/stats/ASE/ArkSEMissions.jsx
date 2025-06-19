import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getMyArkStats } from "../../../managers/arkStatsManager";
import {
  getASEMissionChartOptions,
  getASEMissionGradients,
} from "../../../utils/ASEMissionChartOptions";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  ChartDataLabels
);

export default function ArkSEMissions() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMyArkStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  if (!stats) return <div className="text-white">Loading mission stats...</div>;

  const labels = ["Missions", "Blue OSDs", "Red OSDs", "Purple OSDs"];
  const values = [
    stats.missionsCompleted ?? 0,
    stats.blueOSD ?? 0,
    stats.redOSD ?? 0,
    stats.purpleOSD ?? 0,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: values,
        backgroundColor: (context) => {
          const { chart, dataIndex } = context;
          const chartArea = chart.chartArea;
          if (!chartArea) return "#333";
          return getASEMissionGradients(chart.ctx, chartArea, dataIndex);
        },
        borderRadius: 6,
        barPercentage: 1,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = getASEMissionChartOptions();

  return (
    <div className="text-white" style={{ height: "220px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
