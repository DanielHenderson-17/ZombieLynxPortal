import { useEffect, useState } from "react";
import { getRecentMonthlyPayments } from "../../../managers/dashboardManager";

export default function SalesData() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getRecentMonthlyPayments()
      .then((data) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonth = data.filter((item) => {
          const d = new Date(item.date);
          return (
            d.getUTCFullYear() === currentYear &&
            d.getUTCMonth() === currentMonth
          );
        });

        const lastMonth = data.filter((item) => {
          const d = new Date(item.date);
          const lastMonthDate = new Date(currentYear, currentMonth - 1);
          return (
            d.getUTCFullYear() === lastMonthDate.getUTCFullYear() &&
            d.getUTCMonth() === lastMonthDate.getUTCMonth()
          );
        });

        const totalThisMonth = thisMonth.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        const totalLastMonth = lastMonth.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        const percentChange =
          totalLastMonth > 0
            ? Math.round(
                ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
              )
            : totalThisMonth > 0
            ? 100
            : 0;

        const averagePayment =
          thisMonth.length > 0
            ? (totalThisMonth / thisMonth.length).toFixed(2)
            : "0.00";

        setStats({
          totalThisMonth: totalThisMonth.toFixed(2),
          percentChange,
          transactionCount: thisMonth.length,
          averagePayment,
        });
      })
      .catch((err) => {
        console.error("Failed to load Tebex stats", err);
      });
  }, []);

  if (!stats) return <div className="text-center py-5"></div>;

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
      {/* Revenue Header */}
      <div className="d-flex justify-content-center align-items-center gap-2 bg-header p-4">
        <i className="bi bi-currency-dollar fs-1"></i>
        <div>
          <div className="d-flex justify-content-start align-items-center">
            <h2 className="fw-bold mb-0 me-2">${stats.totalThisMonth}</h2>
            <p className="m-0">{getArrow(stats.percentChange)}</p>
          </div>
          <div className="text-white small text-start">MONTH TO DATE</div>
        </div>
      </div>

      {/* Revenue Details */}
      <div className="d-flex justify-content-between w-100 gap-3 mt-3 pb-2 px-4">
        <div className="text-start">
          <h4 className="fw-semibold mb-0">{stats.transactionCount}</h4>
          <div className="text-white small">TRANSACTIONS</div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-0">${stats.averagePayment}</h4>
          <div className="text-white small">AVG PAYMENT</div>
        </div>
      </div>
    </div>
  );
}
