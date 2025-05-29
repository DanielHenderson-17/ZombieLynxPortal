export function getStatsNavLinks(location) {
  return [
    {
      path: "arkse",
      label: "Ark:SE",
      icon: location.pathname.includes("/member/stats/arkse")
        ? "bi bi-graph-up-arrow text-white"
        : "bi bi-graph-up text-secondary",
      active: location.pathname.includes("/member/stats/arkse"),
    },
    {
      path: "arksa",
      label: "Ark:SA",
      icon: location.pathname.includes("/member/stats/arksa")
        ? "bi bi-bar-chart-fill text-white"
        : "bi bi-bar-chart text-secondary",
      active: location.pathname.includes("/member/stats/arksa"),
    },
    {
      path: "minecraft",
      label: "Minecraft",
      icon: location.pathname.includes("/member/stats/minecraft")
        ? "bi bi-cube-fill text-white"
        : "bi bi-cube text-secondary",
      active: location.pathname.includes("/member/stats/minecraft"),
    },
    {
      path: "rust",
      label: "Rust",
      icon: location.pathname.includes("/member/stats/rust")
        ? "bi bi-hammer text-white"
        : "bi bi-hammer text-secondary",
      active: location.pathname.includes("/member/stats/rust"),
    },
  ];
}
