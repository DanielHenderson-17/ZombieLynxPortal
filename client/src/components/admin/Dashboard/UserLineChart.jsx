import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function UserLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Joins",
        data: data.map((d) => d.joins),
        borderColor: "#4caf50",
        backgroundColor: "#4caf5044",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Leaves",
        data: data.map((d) => d.leaves),
        borderColor: "#f44336",
        backgroundColor: "#f4433644",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          maxTicksLimit: 10,
        },
        grid: {
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "#333",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
        },
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#ddd",
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
