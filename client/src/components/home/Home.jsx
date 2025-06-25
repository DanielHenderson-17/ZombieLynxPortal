import { Suspense, lazy } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import logoMain from "../../assets/home/zlg-logo-main.webp";

export default function Home() {
  const About = lazy(() => import("../about/About"));
  const ServicesListDisplay = lazy(() =>
    import("../services/ServicesListDisplay")
  );
  const ServerListDisplay = lazy(() => import("../server/ServerListDisplay"));
  const ServerStatusDisplay = lazy(() =>
    import("../server/ServerStatusDisplay")
  );

  return (
    <div>
      <div className="home-container col-12 mx-auto p-md-0 pt-0 px-0" id="home">
        {/* Splash Container */}
        <div className="splash-main-container mt-0 bg-dark w">
          <div className="d-flex splash-container splash-bg justify-content-start align-items-center col-12 ps-md-5 position-relative">
            {/* Logo */}
            <div className="splash-logo col-md-5 col-12 text-start ms-md-3 m-0 d-flex justify-content-start align-items-center">
              <div>
                <img
                  src={logoMain}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                  className="ms-3 d-block"
                />
                <div className="us">
                  <div className="d-md-flex d-block justify-content-start pt-3 pb-md-4 pb-0 mt-3 ms-md-3 m-0 mission-statement">
                    <h4 className="text-white text-md-start text-center fw-normal mx-auto mx-md-0 col-10 col-md-11 mt-md-2 p-md-0 p-2 text-shadow2">
                      Your ultimate destination for cutting edge game servers!
                      Elevate your gaming experience today!
                    </h4>
                  </div>
                  <div className="d-flex justify-content-md-start justify-content-center">
                    <Link
                      to="/#ServerStatusDisplay"
                      className="btn btn-success ms-md-3 m-0 fw-bold mt-md-3 mt-0 play-now"
                    >
                      PLAY NOW <i className="bi bi-caret-right-fill"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-md-around justify-content-center col-11 mx-auto zlg-about pt-1">
            {/* Active Admins */}
            <div className="d-md-flex d-block justify-content-center custom-col-3-75 rounded-3 p-md-3 p-0">
              <div className="me-md-3 me-0 d-flex justify-content-center align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  className="bi bi-headset headset-icon"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5" />
                </svg>
              </div>
              <div>
                <h4 className="d-md-block d-none text-white text-start mission-text">
                  Active Admins
                </h4>
                <h5 className="text-md-start text-center text-danger mission-text">
                  We&apos;re here to help!
                </h5>
              </div>
            </div>

            {/* Local Dedicated */}
            <div className="d-md-flex d-block justify-content-center custom-col-3-75 rounded-3 p-md-3 p-0 mx-md-0 mx-3 my-md-0">
              <div className="me-md-3 me-0 d-flex justify-content-center align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  className="bi bi-database headset-icon"
                  viewBox="0 0 16 16"
                >
                  <path d="..." />
                </svg>
              </div>
              <div>
                <h4 className="d-md-block d-none text-white text-start mission-text">
                  Local Dedicated
                </h4>
                <h5 className="text-md-start text-center text-danger mission-text">
                  Locally Ran Servers!
                </h5>
              </div>
            </div>

            {/* Get Rewards */}
            <div className="d-md-flex d-block justify-content-center custom-col-3-75 rounded-3 p-md-3 p-0">
              <div className="me-md-3 me-0 d-flex justify-content-center align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  className="bi bi-coin headset-icon"
                  viewBox="0 0 16 16"
                >
                  <path d="..." />
                </svg>
              </div>
              <div>
                <h4 className="d-md-block d-none text-white text-start mission-text">
                  Get Rewarded
                </h4>
                <h5 className="text-md-start text-center text-danger mission-text">
                  In-Game rewards!
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <Suspense fallback={<div></div>}>
            <About />
            <ServicesListDisplay />
            <ServerListDisplay />
            <ServerStatusDisplay />
          </Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
}
