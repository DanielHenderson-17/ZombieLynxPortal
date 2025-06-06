import { useEffect, useState } from "react";
import {
  getTicketOverviewStats,
  getTicketActivityChartData,
} from "../../../managers/dashboardManager";
import { formatDiscordName } from "../../../utils/formatDiscordName";
import TicketLineChart from "./TicketLineChart";

export default function TicketOverview() {
  const [totalCreated, setTotalCreated] = useState("--");
  const [messageCount, setMessageCount] = useState("--");
  const [avgDuration, setAvgDuration] = useState("--");
  const [completionRate, setCompletionRate] = useState("--");
  const [openTickets, setOpenTickets] = useState("--");
  const [topUser, setTopUser] = useState({
    ticketCount: "--",
    discordName: "",
  });
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    getTicketOverviewStats()
      .then((data) => {
        setTotalCreated(data.totalCreatedLast30Days);
        setMessageCount(data.messageCountLast30Days);
        setAvgDuration(`${data.averageDurationMinutes}m`);
        setCompletionRate(`${data.completionRatePercent}%`);
        setOpenTickets(data.openTicketCount);
        setTopUser(data.topUserByTicketCount);
      })
      .catch((err) => {
        console.error("Failed to load ticket overview stats", err, openTickets);
      });

    getTicketActivityChartData()
      .then((data) => setDailyData(data))
      .catch((err) => {
        console.error("Failed to fetch chart data", err);
      });
  }, []);

  return (
    <div className="p-3 bg-dark">
      <div className="d-flex justify-content-between">
        <h5 className="mb-2 text-start">Ticket Overview</h5>
        <h6 className="text-secondary me-4">30 Days</h6>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-8 p-0">
          <div className="p-md-2 p-0" style={{ height: "320px" }}>
            <TicketLineChart data={dailyData} />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="row row-cols-2 g-3 data-container">
            {/* 1 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{totalCreated}</div>
                <div>TICKETS CREATED</div>
              </div>
            </div>

            {/* 2 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{messageCount}</div>
                <div>MESSAGES</div>
              </div>
            </div>

            {/* 3 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">3m</div>
                <div>AVG. RESPONSE TIME</div>
              </div>
            </div>

            {/* 4 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{avgDuration}</div>
                <div>AVG. DURATION</div>
              </div>
            </div>

            {/* 5 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div className="fs-3 fw-bold">{completionRate}</div>
                <div>COMPLETION RATE</div>
              </div>
            </div>

            {/* 6 */}
            <div className="col">
              <div className="text-white rounded p-md-3 p-1 text-start">
                <div
                  className="fs-3 fw-bold"
                  title={formatDiscordName(topUser.discordName) || "No data"}
                >
                  {topUser.ticketCount}
                </div>
                <div>USER MOST TICKETS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
