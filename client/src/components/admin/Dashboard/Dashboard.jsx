import { useEffect, useState } from "react";
import {
  getMonthlyTicketStats,
  getMonthlyUserStats,
} from "../../../managers/dashboardManager";
import TicketData from "./TicketData";
import UserData from "./UserData";
import TebexData from "./TebexData";

export default function Dashboard() {
  const [ticketStats, setTicketStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    Promise.all([getMonthlyTicketStats(), getMonthlyUserStats()])
      .then(([ticketData, userData]) => {
        setTicketStats(ticketData);
        setUserStats(userData);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats", err);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`d-flex flex-column flex-lg-row fade-container text-white px-md-4 px-1 ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="row g-4 w-100 mx-auto mt-0">
        <div className="col-md-4">
          {userStats && <UserData stats={userStats} />}
        </div>
        <div className="col-md-4">
          {ticketStats && <TicketData stats={ticketStats} />}
        </div>
        <div className="col-md-4">
          <TebexData />
        </div>
      </div>
    </div>
  );
}
