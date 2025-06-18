const rawValueMap = {};

export function getASEPVPChartData(userStats, summary) {
  const normalizeToTen = (value, max) => (max === 0 ? 0 : (value / max) * 10);

  const categories = ["playerKills", "playerDeaths", "kd", "pvPDamage"];
  const userValues = categories.map((key) => userStats[key]);

  const maxValues = categories.map((key) => summary[key]?.max || 1);

  // Get average stats instead of top player
  const avgPlayerStats = {};
  categories.forEach((key) => {
    avgPlayerStats[key] = summary[key]?.avg ?? 0;
  });

  const avgPlayerValues = categories.map((key, i) =>
    normalizeToTen(avgPlayerStats[key], maxValues[i])
  );

  rawValueMap["Your Stats"] = userValues;
  rawValueMap["Average Player"] = categories.map(
    (key) => avgPlayerStats[key] ?? 0
  );

  return {
    labels: ["Player Kills", "Player Deaths", "K/D", "PvP Damage"],
    datasets: [
      {
        label: "Your Stats",
        data: userValues.map((val, i) => normalizeToTen(val, maxValues[i])),
        backgroundColor: "rgba(0, 123, 255, 0.37)",
        borderColor: "#007bff",
        borderWidth: 2,
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#007bff",
        pointRadius: 2,
        pointHoverRadius: 3,
      },
      {
        label: "Average Player",
        data: avgPlayerValues,
        backgroundColor: "rgba(220, 53, 70, 0.44)",
        borderColor: "#dc3545",
        borderWidth: 2,
        pointBackgroundColor: "#dc3545",
        pointBorderColor: "#dc3545",
        pointRadius: 2,
        pointHoverRadius: 3,
      },
    ],
  };
}

export function getASEPVPChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: "#aaa",
          backdropColor: "transparent",
        },
        grid: { color: "#444" },
        angleLines: { color: "#ccc" },
        pointLabels: {
          color: "#fff",
          font: { size: 12, weight: "bold" },
        },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const label = ctx.dataset.label;
            const index = ctx.dataIndex;

            const raw = rawValueMap[label]?.[index];
            return raw !== undefined
              ? `${label}: ${raw}`
              : `${label}: ${ctx.formattedValue}`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  };
}
