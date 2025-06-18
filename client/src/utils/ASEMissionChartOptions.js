export function getASEMissionChartOptions() {
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "start",
        align: "start",
        offset: -20,
        color: "#fff",
        font: { weight: "bold", size: 10 },
        clamp: true,
      },
    },
  };
}

export function getASEMissionGradients(ctx, chartArea, dataIndex) {
  const { left, right } = chartArea;
  const gradient = ctx.createLinearGradient(left, 0, right, 0);

  switch (dataIndex) {
    case 0: // Neon Aqua
      gradient.addColorStop(0, "#0b1f1e");
      gradient.addColorStop(0.2, "#146b69");
      gradient.addColorStop(0.4, "#32fbe2");
      gradient.addColorStop(0.6, "#32fbe2");
      gradient.addColorStop(1, "#32fbe2");
      break;
    case 1: // Blue OSDs (Blue)
      gradient.addColorStop(0, "#001428");
      gradient.addColorStop(0.2, "#3385ff");
      gradient.addColorStop(0.4, "#6ad4ff");
      gradient.addColorStop(0.6, "#6ad4ff");
      gradient.addColorStop(1, "#6ad4ff");
      break;
    case 2: // Red OSDs
      gradient.addColorStop(0, "#2d0500");
      gradient.addColorStop(0.2, "#d53b1a");
      gradient.addColorStop(0.4, "#ff7e4a");
      gradient.addColorStop(0.6, "#ffb07a");
      gradient.addColorStop(1, "#ffd4a8");
      break;
    case 3: // Purple OSDs (Purple)
      gradient.addColorStop(0, "#1b002c");
      gradient.addColorStop(0.2, "#7b3fc2");
      gradient.addColorStop(0.4, "#d87eff");
      gradient.addColorStop(0.6, "#d87eff");
      gradient.addColorStop(1, "#d87eff");
      break;
    default:
      gradient.addColorStop(0, "#222");
      gradient.addColorStop(1, "#444");
  }

  return gradient;
}
