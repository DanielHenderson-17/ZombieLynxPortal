import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExpiredVotes } from "../../managers/voteManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExpiredVotes() {
  const [votes, setVotes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);

    getExpiredVotes()
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.expiresAt) - new Date(a.expiresAt)
        );
        setVotes(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch expired votes:", err);
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-1 pt-0 px-3`}
    >
      <div className="d-md-flex d-none justify-content-between align-items-center mb-4">
        <h3 className="text-white facebook-header m-0 mt-2 ms-1 d-none d-md-block">
          Expired Votes
        </h3>
      </div>

      {votes.length === 0 ? (
        <p className="text-white mt-5">There are no expired votes.</p>
      ) : (
        <ul className="list-unstyled pb-5 mb-5">
          <h3 className="text-white m-0 facebook-header text-start my-2 d-md-none d-block">
            Expired Votes
          </h3>
          {votes.map((vote) => (
            <li
              key={vote.id}
              className="list-group-item single-notification mb-2 rounded-2 shadow py-0 d-flex justify-content-between"
            >
              <div className="text-start ms-md-3 ms-1 p-1 col-md-10 col-8">
                {vote.title && <strong className="mb-0">{vote.title}</strong>}
                <p className="my-1">
                  <small>{vote.description}</small>
                </p>
                {vote.expiresAt && (
                  <small>
                    <i className="mt-2 mb-0 text-secondary">
                      Expired: {new Date(vote.expiresAt).toLocaleString()}
                    </i>
                  </small>
                )}
              </div>

              <div className="my-auto d-flex justify-content-end gap-2 me-3 col">
                <button
                  className="btn btn-primary btn-sm col-md-6 col-8"
                  onClick={() => navigate(`/member/vote/${vote.id}`)}
                >
                  <i className="d-none d-md-inline bi bi-bar-chart-fill me-1"></i>
                  Results
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
