import "../../assets/styles/Home.css";
import ServerListDisplay from "../server/ServerListDisplay";
import ServerStatusDisplay from "../server/ServerStatusDisplay";

export default function Home() {
  return (
    <div className="home-container col-8 mx-auto mt-5 pt-5">
      {/* Splash Container */}
      <div className="d-flex splash-container justify-content-center rounded-3 col-12">
        <div className="splash-logo col-6 my-auto text-end">
          <img src="/src/assets/images/zlg-logo2.png" alt="" />
          <div className="d-flex justify-content-end">
            <p className="text-white text-center col-7 mt-2">
              Your ultimate destination for cutting edge game servers! Elevate
              your gaming experience today!
            </p>
          </div>
        </div>
        <div className="splash-zlg-guy col-6 text-start">
          <img src="/src/assets/images/zlg-guy.png" alt="" />
        </div>
      </div>
      {/* About Us */}
      <div className="d-flex justify-content-between col-12 mt-5 zlg-about">
        <div className="d-flex custom-col-3-75 rounded-3 about-single p-3">
          <div className="col-3 my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="white"
              className="bi bi-headset"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5" />
            </svg>
          </div>
          <div className="col-9">
            <h4 className="text-white text-start">Active Admins</h4>
            <h5 className="text-start text-danger">We&apos;re here to help!</h5>
          </div>
        </div>
        <div className="d-flex custom-col-3-75 rounded-3 about-single p-3 mx-0">
          <div className="col-3 my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="white"
              className="bi bi-database"
              viewBox="0 0 16 16"
            >
              <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" />
            </svg>
          </div>
          <div className="col-9">
            <h4 className="text-white text-start">Local Dedicated</h4>
            <h5 className="text-start text-danger">Locally Ran Servers!</h5>
          </div>
        </div>
        <div className="d-flex custom-col-3-75 rounded-3 about-single p-3">
          <div className="col-3 my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="white"
              className="bi bi-coin"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z" />
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
            </svg>
          </div>
          <div className="col-9">
            <h4 className="text-white text-start">Get Rewarded</h4>
            <h5 className="text-start text-danger">In-Game rewards!</h5>
          </div>
        </div>
      </div>
      {/* ZLG Servers */}

      <ServerListDisplay />
      <ServerStatusDisplay />
    </div>
  );
}
