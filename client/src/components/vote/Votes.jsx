import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ActiveVotes from "./ActiveVotes";
import ExpiredVotes from "./ExpiredVotes";
import CreateVote from "./CreateVote";
import SingleVote from "./SingleVote";
import VotesMobileNav from "./VotesMobileNav";
import "./Vote.css";

export default function Votes({ loggedInUser }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`d-flex flex-column flex-lg-row fade-container ticket-container text-white ${
        isVisible ? "fade-in" : "fade-start"
      }`}
    >
      {/* Sidebar Navigation (Desktop Only) */}
      <div className="col-lg-2 p-3 border ticket-nav d-none d-lg-block border-0">
        <div>
          {loggedInUser?.role === "Admin" && (
            <div>
              <Link
                to="/member/vote/create"
                className={`d-flex justify-content-start text-decoration-none ${
                  location.pathname === "/member/vote/create" ? "active" : ""
                }`}
              >
                <button className="btn btn-success d-flex justify-content-center align-items-center ps-1 pe-2 py-1">
                  <i className="bi bi-plus fs-5 text-white"></i>Create Vote
                </button>
              </Link>
              <hr className="mb-4" />
            </div>
          )}

          <Link
            to="/member/vote/active"
            className={`text-decoration-none ${
              location.pathname.includes("/member/vote/active") ? "active" : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
              <i
                className={`bi me-3 ${
                  location.pathname.includes("/member/vote/active")
                    ? "bi-check-square-fill text-white"
                    : "bi-check-square text-secondary"
                }`}
              ></i>
              <p
                className={`m-0 p-0 ${
                  location.pathname.includes("/member/vote/active")
                    ? "text-white"
                    : "text-secondary"
                }`}
              >
                Active
              </p>
            </button>
          </Link>

          <Link
            to="/member/vote/expired"
            className={`text-decoration-none ${
              location.pathname.includes("/member/vote/expired") ? "active" : ""
            }`}
          >
            <button className="btn d-block w-100 text-start mb-2 d-flex align-items-center">
              <i
                className={`bi me-3 ${
                  location.pathname.includes("/member/vote/expired")
                    ? "bi-clock-fill text-white"
                    : "bi-clock text-secondary"
                }`}
              ></i>
              <p
                className={`m-0 p-0 ${
                  location.pathname.includes("/member/vote/expired")
                    ? "text-white"
                    : "text-secondary"
                }`}
              >
                Expired
              </p>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 mb-0 ticket-main">
        <Routes>
          <Route path="active" element={<ActiveVotes />} />
          <Route path="expired" element={<ExpiredVotes />} />
          <Route path="create" element={<CreateVote />} />
          <Route path=":voteId" element={<SingleVote />} />
          <Route path="" element={<ActiveVotes />} />
        </Routes>
      </div>

      <VotesMobileNav loggedInUser={loggedInUser} />
    </div>
  );
}
