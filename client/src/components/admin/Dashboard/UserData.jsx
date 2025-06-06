export default function UserData({ stats }) {
  const getArrow = (percent) => {
    if (percent > 0) return <span className="text-success">▲ {percent}%</span>;
    if (percent < 0)
      return (
        <span className="text-danger p-1 rounded-1">
          ▼ {Math.abs(percent)}%
        </span>
      );
    return <span className="text-muted">0%</span>;
  };

  return (
    <div className="bg-dark text-white p-0 rounded d-block border border-card shadow-sm">
      {/* Users this Month */}
      <div className="d-flex justify-content-center align-items-center gap-3 bg-header p-4">
        <i className="bi bi-person-plus-fill fs-1"></i>
        <div>
          <div className="d-flex justify-content-start align-items-center">
            <h2 className="fw-bold mb-0 me-2">
              {stats.joinsThisMonth}/{stats.leavesThisMonth}
            </h2>
            <p className="m-0">{getArrow(stats.percentChange)}</p>
          </div>
          <div className="text-white small text-start">
            JOIN/LEAVE MONTH TO DATE
          </div>
        </div>
      </div>

      {/* User Data */}
      <div className="d-flex justify-content-between w-100 gap-3 mt-3 pb-2 px-4">
        <div className="text-start">
          <h4 className="fw-semibold mb-0">{stats.totalUsers}</h4>
          <div className="text-white small">TOTAL USERS</div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-0">{stats.avgPerDay}</h4>
          <div className="text-white small">AVG. DAY</div>
        </div>
      </div>
    </div>
  );
}
