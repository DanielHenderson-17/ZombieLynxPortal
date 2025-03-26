import { Link, Route, Routes, useLocation } from "react-router-dom";
import OpenTickets from "./OpenTickets";
import ClosedTickets from "./ClosedTickets";
import NewTicket from "./NewTicket";
import SingleTicket from "./SingleTicket";
import EditTicket from "./EditTicket";
import "../../assets/styles/tickets.css";
import { useEffect, useState } from "react";
import { getOpenTickets } from "../../managers/ticketManager";

export default function Tickets({ loggedInUser }) {
  const [openTicketCount, setOpenTicketCount] = useState(0);
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
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row ticket-container">
      {/* Sidebar for Desktop Navigation */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          {/* New Ticket Button */}
          <Link
            to="/member/tickets/new-ticket"
            className={`d-flex justify-content-end text-decoration-none ${
              location.pathname === "/member/tickets/new-ticket" ? "active" : ""
            }`}
          >
            <button className="btn d-block d-flex align-items-center col-6 text-start mb-3 btn-success create-ticket">
              <i className="bi bi-plus-circle me-2"></i>
              <p className="m-0 p-0">Create</p>
            </button>
          </Link>

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

          <hr />

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
      <div className="d-lg-none fixed-bottom bg-dark text-white bottom-nav">
        <div className="d-flex justify-content-around pt-2 pb-1 my-1">
          {/* New Ticket Button */}
          <Link
            to="/member/tickets/new-ticket"
            className={`text-decoration-none text-white ${
              location.pathname === "/member/tickets/new-ticket" ? "active" : ""
            }`}
          >
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-plus-circle fs-4"></i>
            </div>
          </Link>

          {/* Open Tickets Button */}
          <Link
            to="/member/tickets/open-tickets"
            className={`text-decoration-none text-white ${
              location.pathname === "/member/tickets/open-tickets"
                ? "active"
                : ""
            }`}
          >
            <div className="d-flex flex-column align-items-center position-relative">
              <i className="bi bi-inbox fs-4 mt-1"></i>
              {openTicketCount > 0 && (
                <span className="badge bg-primary position-absolute top-0 start-50 translate-middle">
                  {openTicketCount}
                </span>
              )}
            </div>
          </Link>

          {/* Closed Tickets Button */}
          <Link
            to="/member/tickets/closed-tickets"
            className={`text-decoration-none text-white ${
              location.pathname === "/member/tickets/closed-tickets"
                ? "active"
                : ""
            }`}
          >
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-trash3 fs-4"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
