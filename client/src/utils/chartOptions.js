export function getVoteChartOptions(votesFor, votesAgainst) {
  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
    },
    credits: { enabled: false },
    title: { text: null },
    plotOptions: {
      pie: {
        innerSize: 200,
        depth: 80,
        dataLabels: {
          enabled: false,
          style: { color: "#fff" },
        },
      },
    },
    series: [
      {
        name: "Votes",
        data: [
          { name: "Yes", y: votesFor, color: "#198754" },
          { name: "No", y: votesAgainst, color: "#dc3545" },
        ],
      },
    ],
    legend: {
      itemStyle: { color: "#fff" },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 340,
          },
          chartOptions: {
            chart: {
              height: 300,
            },
            plotOptions: {
              pie: {
                innerSize: 150,
                depth: 60,
              },
            },
          },
        },
      ],
    },
  };
}
