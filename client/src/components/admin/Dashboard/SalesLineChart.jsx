import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
);

export default function SalesLineChart({ data }) {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: data.map((entry) => entry.revenue),
        fill: true,
        tension: 0.3,
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM d",
          displayFormats: {
            day: "MMM d",
          },
        },
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "#444",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "#444",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
