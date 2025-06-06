import { useEffect, useState } from "react";
import {
  getSalesOverviewStats,
  getSalesChartData,
} from "../../../managers/dashboardManager";
import SalesLineChart from "./SalesLineChart";
import { formatDiscordName } from "../../../utils/formatDiscordName";

export default function SalesOverview() {
  const [totalRevenue, setTotalRevenue] = useState("--");
  const [totalTransactions, setTotalTransactions] = useState("--");
  const [averagePayment, setAveragePayment] = useState("--");
  const [dailyAverage, setDailyAverage] = useState("--");
  const [topBuyer, setTopBuyer] = useState("--");
  const [topBuyerAmount, setTopBuyerAmount] = useState("--");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [stats, chart] = await Promise.all([
          getSalesOverviewStats(),
          getSalesChartData(),
        ]);

        if (!isMounted) return;

        setTotalRevenue(stats.totalRevenue.toFixed(2));
        setTotalTransactions(stats.totalTransactions);
        setAveragePayment(stats.averagePayment.toFixed(2));
        setDailyAverage(stats.dailyAverage.toFixed(2));
        setTopBuyer(stats.topBuyer.username || "--");
        setTopBuyerAmount(stats.topBuyer.totalSpent.toFixed(2));
        setChartData(chart);
      } catch (err) {
        console.error("Failed to load sales overview or chart data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-5 mt-5 text-center text-white">
        <div className="spinner-border text-light mt-5" role="status" />
        <div className="mt-3">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-dark">
      <div className="d-flex justify-content-between">
        <h5 className="mb-2 text-start">Sales Overview</h5>
        <h6 className="text-secondary me-4">30 Days</h6>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-8 p-0">
          <div className="p-md-2 p-0" style={{ height: "320px" }}>
            <SalesLineChart data={chartData} />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="row row-cols-2 g-3 data-container">
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">${totalRevenue}</div>
                <div>TOTAL REVENUE</div>
              </div>
            </div>
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{totalTransactions}</div>
                <div>TRANSACTIONS</div>
              </div>
            </div>
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">${averagePayment}</div>
                <div>AVG PAYMENT</div>
              </div>
            </div>
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">${dailyAverage}</div>
                <div>DAILY AVG</div>
              </div>
            </div>
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">
                  {formatDiscordName(topBuyer)}
                </div>
                <div>TOP BUYER</div>
              </div>
            </div>
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">${topBuyerAmount}</div>
                <div>TOP BUYER TOTAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
