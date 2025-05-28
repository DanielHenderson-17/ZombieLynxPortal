import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveVotes, submitVote } from "../../managers/voteManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ActiveVotes() {
  const [votes, setVotes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);

    getActiveVotes()
      .then((data) => {
        const sorted = data.sort((a, b) => {
          if (a.hasVoted === b.hasVoted) return 0;
          return a.hasVoted ? 1 : -1;
        });
        setVotes(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch active votes:", err);
      });

    return () => clearTimeout(timer);
  }, []);

  const handleVote = async (voteId, votedFor) => {
    try {
      await submitVote(voteId, votedFor);
      toast.success("Your vote has been cast!", { autoClose: 1500 });
      setTimeout(() => {
        navigate(`/member/vote/${voteId}`);
      }, 1800);
    } catch (err) {
      console.error("Error submitting vote:", err);
      toast.error(err.message || "Failed to submit vote.");
    }
  };

  return (
    <div
      className={`notifications-container fade-container pb-5 ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-1 pt-0 px-3`}
    >
      <div className="d-md-flex d-none justify-content-between align-items-center mb-4">
        <h3 className="text-white facebook-header m-0 mt-2 ms-1 d-none d-md-block">
          Active Votes
        </h3>
      </div>

      {votes.length === 0 ? (
        <p className="text-white mt-5">There are currently no active votes.</p>
      ) : (
        <ul className="list-unstyled pb-5 mb-5">
          <h3 className="text-white m-0 facebook-header text-start my-2 d-md-none d-block">
            Active Votes
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
                      Expires: {new Date(vote.expiresAt).toLocaleString()}
                    </i>
                  </small>
                )}
              </div>

              <div className="my-auto d-flex justify-content-end gap-2 me-3 col">
                {!vote.isEligible ? (
                  <span
                    title={
                      vote.ineligibilityReason ||
                      "You are not eligible to vote on this"
                    }
                  >
                    <button className="btn btn-secondary btn-sm" disabled>
                      <i className="bi bi-lock-fill me-1"></i> Ineligible
                    </button>
                  </span>
                ) : !vote.hasVoted ? (
                  <div className="w-50 d-flex justify-content-end text-end">
                    <button
                      className="btn btn-success btn-sm me-2"
                      title="Vote For"
                      onClick={() => handleVote(vote.id, true)}
                    >
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Vote Against"
                      onClick={() => handleVote(vote.id, false)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-sm col-md-6 col-8"
                    onClick={() => navigate(`/member/vote/${vote.id}`)}
                  >
                    <i className="d-none d-md-inline bi bi-bar-chart-fill me-1"></i>
                    Results
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
