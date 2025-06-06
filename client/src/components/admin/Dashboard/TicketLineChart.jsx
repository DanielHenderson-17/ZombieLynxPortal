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

export default function TicketLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Tickets Created",
        data: data.map((d) => d.count),
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb44",
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
