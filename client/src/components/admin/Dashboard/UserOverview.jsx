import { useEffect, useState } from "react";
import UserLineChart from "./UserLineChart";
import UserStatusDoughnutChart from "./UserStatusDoughnutChart";
import {
  getUserOverviewStats,
  getUserActivityChartData,
} from "../../../managers/dashboardManager";

export default function UserOverview() {
  const [joins, setJoins] = useState("--");
  const [leaves, setLeaves] = useState("--");
  const [activeUsers, setActiveUsers] = useState("--");
  const [inactiveUsers, setInactiveUsers] = useState("--");
  const [marketingYes, setMarketingYes] = useState("--");
  const [marketingNo, setMarketingNo] = useState("--");
  const [dailyRevenueData, setDailyRevenueData] = useState([]);

  useEffect(() => {
    getUserOverviewStats()
      .then((stats) => {
        setJoins(stats.joinsLast30Days);
        setLeaves(stats.leavesLast30Days);
        setActiveUsers(stats.activeUsers);
        setInactiveUsers(stats.inactiveUsers);
        setMarketingYes(stats.marketingOptIns);
        setMarketingNo(stats.marketingOptOuts);
      })
      .catch((err) => {
        console.error("Failed to load user overview stats", err);
      });

    getUserActivityChartData()
      .then((data) => setDailyRevenueData(data))
      .catch((err) =>
        console.error("Failed to load user activity chart data", err)
      );
  }, []);

  return (
    <div className="p-3 bg-dark">
      <div className="d-flex justify-content-between">
        <h5 className="mb-2 text-start">User Overview</h5>
        <h6 className="text-secondary me-4">30 Days</h6>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-8 p-0 d-md-flex d-block justify-content-center align-items-center">
          <div
            className="p-md-2 p-0 col-md-8 col-12"
            style={{ height: "320px" }}
          >
            <UserLineChart data={dailyRevenueData} />
          </div>
          <div className="mt-0 d-flex flex-column align-items-center gap-4">
            <div className="w-100 text-center pb-3">
              <h6 className="text-white mb-2">Activity</h6>
              <div style={{}}>
                <UserStatusDoughnutChart
                  active={parseInt(activeUsers) || 0}
                  inactive={parseInt(inactiveUsers) || 0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="row row-cols-2 g-3 data-container">
            {/* 1 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{joins}</div>
                <div>JOINS</div>
              </div>
            </div>

            {/* 2 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{leaves}</div>
                <div>LEAVES</div>
              </div>
            </div>

            {/* 3 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{activeUsers}</div>
                <div>ACTIVE USERS</div>
              </div>
            </div>

            {/* 4 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{inactiveUsers}</div>
                <div>INACTIVE USERS</div>
              </div>
            </div>

            {/* 5 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{marketingYes}</div>
                <div>ALLOWS MARKETING</div>
              </div>
            </div>

            {/* 6 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{marketingNo}</div>
                <div>NO MARKETING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
