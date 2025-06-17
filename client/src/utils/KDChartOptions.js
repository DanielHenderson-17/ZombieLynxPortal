// KDChartOptions.js

// ✅ Base color chart — no labels
export function getKDChartBackgroundData() {
  return {
    labels: ["", "", "", ""],
    datasets: [
      {
        data: [1, 2, 2, 2],
        backgroundColor: [
          "#dc3545", // Red: 0–1
          "#ffc107", // Yellow: 1–3
          "#0dcaf0", // Blue: 3–5
          "#198754", // Green: 5+
        ],
        borderWidth: 0,
        cutout: "65%",
        circumference: 180,
        rotation: -90,
        datalabels: {
          display: true,
          color: "rgba(0, 0, 0, 0)",
        },
      },
    ],
  };
}

// ✅ Top layer — tick divisions with labels
export function getKDChartOverlayData() {
  return {
    labels: ["0", ".5", "1", "2", "3", "4", "5", "6+"],
    datasets: [
      {
        data: [0.5, 0.5, 1, 1, 1, 1, 1, 1],
        backgroundColor: [
          "#ccc",
          "#bbb",
          "#aaa",
          "#999",
          "#888",
          "#777",
          "#666",
          "#555",
        ],
        borderColor: "#fff",
        borderWidth: 1,
        circumference: 180,
        rotation: -90,
        cutout: "84%",
        radius: "102%",
        datalabels: {
          color: "#fff",
          font: {
            size: 12,
            weight: "bold",
          },
          formatter: (_, ctx) => ctx.chart.data.labels[ctx.dataIndex],
        },
      },
    ],
  };
}

// ✅ Shared chart options
export function getKDChartOptions(myKD, maxKD = 7) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    rotation: 180,
    circumference: 180,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      title: {
        display: true,
        text: `K/D Ratio`,
        color: "#fff",
        padding: { top: 10, bottom: 10 },
        font: { size: 16, weight: "bold" },
      },
      needle: {
        value: myKD,
        maxValue: maxKD,
      },
    },
  };
}
