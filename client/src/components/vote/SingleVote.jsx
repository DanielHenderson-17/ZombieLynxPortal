import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVoteResults } from "../../managers/voteManager";
import { getVoteGameImage } from "../../utils/voteGame";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { truncateText } from "../../utils/truncateText";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SingleVote() {
  const { voteId } = useParams();
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getVoteResults(voteId)
      .then((data) => {
        setVote(data);
      })
      .catch((err) => {
        setError("Failed to load vote results.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [voteId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="text-white">Loading vote...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!vote || !vote.results)
    return <div className="text-white">No results.</div>;

  const { for: votesFor, against: votesAgainst, totalVotes } = vote.results;
  const percentFor = Math.round((votesFor / totalVotes) * 100);
  const percentAgainst = 100 - percentFor;
  const winningSide = votesFor >= votesAgainst ? "yes" : "no";

  const chartData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: [votesFor, votesAgainst],
        backgroundColor: ["#198754", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    layout: {
      padding: {
        bottom: 30,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#fff",
          padding: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} (${Math.round(
              (context.raw / totalVotes) * 100
            )}%)`,
        },
      },
    },
  };

  return (
    <div
      className={`fade-container pb-0 pt-3 text-white d-flex align-items-center mx-auto col-md-10 col-12  ${
        isVisible ? "fade-in" : "fade-start"
      } pt-md-5 pt-0 px-2`}
    >
      <div className="px-0 pt-md-5 mt-md-0 mt-0 rounded-3 col-12 mx-auto bg-md-dark d-md-flex d-block align-items-center px-md-5">
        <div
          className="d-flex flex-row mb-md-5 mb-md-4 mb-1 vote-header col-12 col-md-6 rounded-3 bg-dark shadow"
          style={{ gap: ".2rem" }}
        >
          <div className="text-center p-2 p-md-0 vote-img">
            <img
              src={getVoteGameImage(vote.game)}
              alt={vote.game}
              className="rounded-1"
            />
          </div>

          <div style={{ flex: 4 }} className="text-start pe-1 vote-text">
            <h2 className="mb-md-2 mb-1 mt-md-2 mt-0 vote-title">
              {vote.title}
            </h2>
            <p className="mb-0 vote-description">
              {truncateText(vote.description, 95)}
            </p>
            {vote.userVote !== null && (
              <div className="d-none d-md-block mt-2 align-self-bottom">
                <p className="text-white mb-0">
                  Your vote:{" "}
                  <span
                    className={vote.userVote ? "text-success" : "text-danger"}
                  >
                    {vote.userVote ? "✅" : "❌"}
                  </span>
                </p>
                <p className="mt-1 p-0">
                  Total Votes :{" "}
                  <span className="text-success fw-bold">{votesFor}</span> /{" "}
                  <span className="text-danger fw-bold">{votesAgainst}</span>{" "}
                  <span className="fw-bold">({totalVotes})</span>
                </p>
              </div>
            )}
          </div>
        </div>
        {vote.userVote !== null && (
          <div className="d-flex d-md-none mt-0 justify-content-between align-items-start mx-1">
            <p className="text-white mb-0 mt-1">
              Your vote:{" "}
              <span className={vote.userVote ? "text-success" : "text-danger"}>
                {vote.userVote ? "✅" : "❌"}
              </span>
            </p>
            <p className="mt-1 p-0">
              Total Votes :{" "}
              <span className="text-success fw-bold">{votesFor}</span> /{" "}
              <span className="text-danger fw-bold">{votesAgainst}</span>{" "}
              <span className="fw-bold">({totalVotes})</span>
            </p>
          </div>
        )}
        <div
          className="position-relative pt-md-2 pt-0"
          style={{
            width: "90%",
            maxWidth: "450px",
            margin: "0 auto",
          }}
        >
          <Doughnut data={chartData} options={chartOptions} />
          <div
            className={`position-absolute translate-middle d-flex align-items-center justify-content-center chart-text ${
              winningSide === "yes" ? "text-success" : "text-danger"
            }`}
          >
            {/* Text stack */}
            <div
              className="d-flex flex-column text-center"
              style={{ lineHeight: 1.2 }}
            >
              <div style={{ fontSize: "2.5rem" }}>
                {winningSide === "yes"
                  ? `${percentFor}%`
                  : `${percentAgainst}%`}
              </div>
              <div style={{ fontSize: "1.5rem" }}>
                {winningSide === "yes" ? "In Favor" : "Against"}
              </div>
            </div>

            {/* Arrow */}
            <div>
              <i
                className={`fs-1 bi ${
                  winningSide === "yes" ? "bi-arrow-up" : "bi-arrow-down"
                }`}
                style={{
                  color: winningSide === "yes" ? "#198754" : "#dc3545",
                }}
              ></i>
            </div>
          </div>
          {vote.expiresAt && (
            <p className="text-secondary text-center mt-0">
              {new Date(vote.expiresAt) < new Date()
                ? "Vote Has Ended"
                : `Vote Ends: ${new Date(vote.expiresAt).toLocaleString()}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
