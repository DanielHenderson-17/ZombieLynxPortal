export default function TicketData({ stats }) {
  const getArrow = (percent) => {
    if (percent > 0) return <span className="text-danger">▲ {percent}%</span>;
    if (percent < 0)
      return (
        <span className="text-success p-1 rounded-1">
          ▼ {Math.abs(percent)}%
        </span>
      );
    return <span className="text-muted">0%</span>;
  };

  return (
    <div className="bg-dark text-white p-0 rounded d-block border border-card shadow-sm">
      {/* Tickets this Month */}
      <div className="d-flex justify-content-center align-items-center gap-3 bg-header p-4">
        <i className="bi bi-ticket-fill fs-1 rotate-45"></i>
        <div>
          <div className="d-flex justify-content-start align-items-center">
            <h2 className="fw-bold mb-0 me-2">{stats.openedThisMonth}</h2>
            <p className="m-0">{getArrow(stats.percentChange)}</p>
          </div>
          <div className="text-white small text-start">
            TICKETS MONTH TO DATE
          </div>
        </div>
      </div>

      {/* Ticket Data */}
      <div className="d-flex justify-content-between w-100 gap-3 mt-3 pb-2 px-4">
        <div className="text-start">
          <h4 className="fw-semibold mb-0">{stats.closedThisMonth}</h4>
          <div className="text-white small">CLOSED THIS MONTH</div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-0">{stats.avgOpenedPerDay}</h4>
          <div className="text-white small">AVG. DAY</div>
        </div>
      </div>
    </div>
  );
}
