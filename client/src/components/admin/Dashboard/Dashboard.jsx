import { useEffect, useState } from "react";
import {
  getMonthlyTicketStats,
  getMonthlyUserStats,
} from "../../../managers/dashboardManager";
import TicketData from "./TicketData";
import UserData from "./UserData";
import TebexData from "./TebexData";
import UserReports from "./UserReports";
import TicketReports from "./TicketReports";
import TebexReports from "./TebexReports";

export default function Dashboard() {
  const [ticketStats, setTicketStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Sales Overview");

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Sales Overview":
        return <TebexReports />;
      case "User Overview":
        return <UserReports />;
      case "Ticket Overview":
        return <TicketReports />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`d-flex notifications-container flex-column fade-container text-white px-md-4 px-1 ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      <div className="row g-4 w-100 mx-auto mt-0">
        <div className="col-md-4">
          <TebexData />
        </div>
        <div className="col-md-4">
          {userStats && <UserData stats={userStats} />}
        </div>
        <div className="col-md-4">
          {ticketStats && <TicketData stats={ticketStats} />}
        </div>
      </div>

      <div className="d-flex justify-content-md-start justify-content-between mt-4 mx-2">
        {["Sales Overview", "User Overview", "Ticket Overview"].map((tab) => (
          <button
            key={tab}
            className={`rounded-top-2 rounded-bottom-0 btn dashboard-select px-2 ${
              activeTab === tab
                ? "btn-dark border-card-top text-white"
                : "btn-no-style text-secondary"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-0 mx-2 border-card-bottom shadow-sm mb-3">
        {renderTabContent()}
      </div>
    </div>
  );
}
