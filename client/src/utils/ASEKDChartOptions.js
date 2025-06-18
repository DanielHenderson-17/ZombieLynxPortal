export function getKDChartBackgroundData(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 320, 0);

  // 🔴 Aggressively dominant red
  gradient.addColorStop(0.0, "#300000"); // blood red
  gradient.addColorStop(0.1, "#4B0000"); // dark red
  gradient.addColorStop(0.2, "#8B0000"); // classic dark red
  gradient.addColorStop(0.3, "#B22222"); // firebrick
  gradient.addColorStop(0.4, "#800000"); // base red

  // 🟣 Compressed purple transition
  gradient.addColorStop(0.6, "#6A0DAD"); // violet
  gradient.addColorStop(0.75, "#483D8B"); // dark slate blue

  // 🔵 Final blue wedge
  gradient.addColorStop(1.0, "#00008B"); // navy

  return {
    labels: [""],
    datasets: [
      {
        data: [1],
        backgroundColor: [gradient],
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cutout: "65%",
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
        borderColor: "darkgray",
        borderWidth: 1,
        circumference: 180,
        rotation: -90,
        cutout: "90%",
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
