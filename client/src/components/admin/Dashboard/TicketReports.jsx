import { useEffect, useState } from "react";
import { getAllMessagesCount } from "../../../managers/messageManager";
import { getMonthlyTicketStats } from "../../../managers/dashboardManager";
import { formatDiscordName } from "../../../utils/formatDiscordName";
import {
  getOpenTickets,
  getAverageTicketDuration,
  getTopUserByTicketCount,
  getDailyTicketCounts,
} from "../../../managers/ticketManager";
import TicketLineChart from "./TicketLineChart";

export default function TicketReports() {
  const [last30Days, setLast30Days] = useState("--");
  const [ticketStats, setTicketStats] = useState(null);
  const [openTicketCount, setOpenTicketCount] = useState("--");
  const [avgDuration, setAvgDuration] = useState("--");
  const [dailyData, setDailyData] = useState([]);
  const [totalCreated, setTotalCreated] = useState("--");
  const [topUser, setTopUser] = useState({
    ticketCount: "--",
    discordName: "",
  });

  useEffect(() => {
    getDailyTicketCounts()
      .then((data) => {
        setDailyData(data);
        const total = data.reduce((sum, day) => sum + day.count, 0);
        setTotalCreated(total);
      })
      .catch((err) => console.error("Failed to fetch chart data:", err));
  }, []);

  useEffect(() => {
    getTopUserByTicketCount()
      .then((data) => setTopUser(data))
      .catch((err) => {
        console.error("Failed to fetch top user by ticket count", err);
      });
  }, []);

  useEffect(() => {
    getAllMessagesCount().then(({ last30Days }) => {
      setLast30Days(last30Days);
    });
  }, []);

  useEffect(() => {
    getMonthlyTicketStats()
      .then((data) => {
        setTicketStats(data);
      })
      .catch((err) => {
        console.error("Failed to load ticket stats", err, ticketStats);
      });
  }, []);

  useEffect(() => {
    getOpenTickets()
      .then((tickets) => {
        setOpenTicketCount(tickets.length);
      })
      .catch((err) => {
        console.error("Failed to fetch open tickets", err, openTicketCount);
      });
  }, []);

  useEffect(() => {
    getAverageTicketDuration()
      .then((minutes) => {
        setAvgDuration(`${minutes}m`);
      })
      .catch((err) => {
        console.error("Failed to fetch average ticket duration", err);
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
                <div className="fs-3 fw-bold">{last30Days}</div>
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
                <div className="fs-3 fw-bold">100%</div>
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
