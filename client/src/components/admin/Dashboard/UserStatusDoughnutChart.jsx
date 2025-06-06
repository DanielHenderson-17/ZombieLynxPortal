import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserStatusDoughnutChart({ active, inactive }) {
  const data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} />;
}
