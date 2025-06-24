import "./About.css";
import about1 from "../../assets/about/about1.webp";
import about2 from "../../assets/about/about2.webp";
import about3 from "../../assets/about/about3.webp";
import aboutArrow from "../../assets/about/aboutArrow.webp";

export default function About() {
  return (
    <div
      className="col-12 pt-1 about-container pt-md-5 pt-5"
      data-aos="fade-up"
    >
      <div className="col-11 mx-auto mt-4">
        <h3 className="text-start text-danger server-status-title mb-3">
          IT PAYS <span className="text-white ms-2">TO PLAY</span>
          <span className="server-status-line"></span>
        </h3>
      </div>

      {/* How it Works */}
      <div className="d-md-flex d-block mt-md-5 mt-0 justify-content-center align-items-center col-10 mx-auto py-md-5 py-2">
        <div className="col">
          <h4 className="text-white mb-3 explanation-text">
            <span className="text-danger me-2 fw-bold">1.</span>
            Play Our ZLG Games!
          </h4>
          <img
            src={about1}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="explanation-img mb-5"
          />
        </div>

        <img
          src={aboutArrow}
          className="aboutArrow d-none d-md-block"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />

        <div className="col">
          <h4 className="text-white mb-3 explanation-text">
            <span className="text-danger me-2 fw-bold">2.</span>
            Earn or Purchase ZLG Points!
          </h4>
          <img
            src={about2}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="explanation-img mb-5"
          />
        </div>

        <img
          src={aboutArrow}
          className="aboutArrow d-none d-md-block"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />

        <div className="col">
          <h4 className="text-white mb-3 explanation-text">
            <span className="text-danger me-2 fw-bold">3.</span>
            Spend Points in Any Game!*
          </h4>
          <img
            src={about3}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="explanation-img mb-md-5 mb-4"
          />
        </div>
      </div>

      <h1 className="text-white mt-md-5 mt-1 pt-1 play-anywhere">
        <i>
          <span className="text-danger">Play</span> Anywhere,{" "}
          <span className="text-danger">Earn</span> Anywhere,{" "}
          <span className="text-danger">Spend</span> Freely!
        </i>
      </h1>
      <h6 className="text-secondary play-disclaimer">
        <i>*Select games available for spending points.</i>
      </h6>
    </div>
  );
}
