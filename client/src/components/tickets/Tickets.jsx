import { Link, Route, Routes, useLocation } from "react-router-dom";
import OpenTickets from "./OpenTickets";
import ClosedTickets from "./ClosedTickets";
import NewTicket from "./NewTicket";
import SingleTicket from "./SingleTicket";
import EditTicket from "./EditTicket";
import "./Tickets.css";
import { useEffect, useState } from "react";
import { getOpenTickets } from "../../managers/ticketManager";
import TicketMobileNav from "./TicketMobileNav";

export default function Tickets({ loggedInUser }) {
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const fetchOpenTicketCount = async () => {
    try {
      const tickets = await getOpenTickets();
      setOpenTicketCount(tickets.length);
    } catch (error) {
      console.error("Error fetching open ticket count:", error);
    }
  };

  useEffect(() => {
    fetchOpenTicketCount();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`d-flex flex-column flex-lg-row fade-container ticket-container ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      {/* Sidebar for Desktop Navigation */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          {/* Create Ticket Button */}
          <Link
            to="/member/tickets/new-ticket"
            className={`d-flex justify-content-start text-decoration-none ${
              location.pathname === "/member/tickets/new-ticket" ? "active" : ""
            }`}
          >
            <button className="btn btn-success d-flex justify-content-center align-items-center ps-1 pe-2 py-1">
              <i className="bi bi-plus fs-5 text-white"></i>Create Ticket
            </button>
          </Link>
          <hr className="mb-4" />

          {/* Open Tickets Button */}
          <Link
            to="/member/tickets/open-tickets"
            className={`text-decoration-none ${
              location.pathname === "/member/tickets/open-tickets"
                ? "active"
                : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center open-tickets">
                <i className="bi bi-inbox me-3 text-white"></i>
                <p className="m-0 p-0">Open</p>
              </div>
              {openTicketCount > 0 && (
                <span className="badge bg-primary ms-2 open-ticket-count">
                  {openTicketCount}
                </span>
              )}
            </button>
          </Link>

          {/* Closed Tickets Button */}
          <Link
            to="/member/tickets/closed-tickets"
            className={`text-decoration-none ${
              location.pathname === "/member/tickets/closed-tickets"
                ? "active"
                : ""
            }`}
          >
            <button className="btn d-block w-100 text-start text-white">
              <div className="d-flex align-items-center closed-tickets">
                <i className="bi bi-trash3 me-3 text-white"></i>
                <p className="m-0 p-0">Trash</p>
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 mb-0 ticket-main">
        <Routes>
          <Route
            path="ticket/:ticketId/edit"
            element={<EditTicket loggedInUser={loggedInUser} />}
          />
          <Route
            path="new-ticket"
            element={<NewTicket loggedInUser={loggedInUser} />}
          />
          <Route
            path="open-tickets"
            element={<OpenTickets onTicketChange={fetchOpenTicketCount} />}
          />
          <Route
            path=""
            element={<OpenTickets onTicketChange={fetchOpenTicketCount} />}
          />
          <Route
            path="closed-tickets"
            element={<ClosedTickets onTicketChange={fetchOpenTicketCount} />}
          />
          <Route
            path="ticket/:ticketId"
            element={<SingleTicket loggedInUser={loggedInUser} />}
          />
        </Routes>
      </div>

      {/* Bottom Navigation for Mobile */}
      <TicketMobileNav openTicketCount={openTicketCount} />
    </div>
  );
}
