// ✅ Base color chart — no labels
export function getKDChartBackgroundData(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 320, 0);
  gradient.addColorStop(0, "#5a0000"); //  dark red
  gradient.addColorStop(0, "#8B0000"); //  deep red
  gradient.addColorStop(0.15, "#ff0000"); //  red
  gradient.addColorStop(0.25, "#ff6600"); //  orange
  gradient.addColorStop(0.35, "#ffcc00"); //  yellow
  gradient.addColorStop(0.45, "#ccff66"); // lime-yellow
  gradient.addColorStop(0.55, "#66ff66"); // light green
  gradient.addColorStop(0.7, "#33cc33"); // green
  gradient.addColorStop(1, "#008000"); // ✅ saturated green

  return {
    labels: [""],
    datasets: [
      {
        data: [1], // single arc for gradient to work
        backgroundColor: [gradient], // ✅ WRAPPED IN ARRAY
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cutout: "70%",
        circumference: 180,
        rotation: -90,
        datalabels: {
          display: false,
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
          "#999",
          "#999",
          "#999",
          "#999",
          "#888",
          "#777",
          "#666",
          "#555",
        ],
        borderColor: "gray",
        borderWidth: 1,
        circumference: 180,
        rotation: -90,
        cutout: "84%",
        radius: "102%",
        datalabels: {
          color: "#fff",
          font: {
            size: 11,
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
        text: ``,
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
