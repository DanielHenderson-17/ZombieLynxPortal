import "../../assets/styles/ServicesListDisplay.css";

export default function ServicesListDisplay() {
  return (
    <div>
      {/* Server Status Header */}
      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">Services</span>
        <span className="server-status-line"></span>
      </h3>
      <div className="d-flex justify-content-center col-12">
        <div className="col-5 justify-content-start d-flex">
          <img
            src="/src/assets/images/extra-life.png"
            alt=""
            className="extra-life rounded-3 text-start"
          />
        </div>
        <div className="col-7 rounded-3 bg-dark text-white p-3 align-items-center d-flex extra-life-text">
          <p className="my-auto align-middle">
            5% of all money earned via Zombie Lynx Gaming goes directly to the
            Monroe Carell Jr. Children&apos;s Hospital at Vanderbilt. If you
            find a need to donate to them directly you can do so{" "}
            <a
              href="https://www.extra-life.org/participant/ZombieLynxGaming"
              className="text-decoration-none text-danger"
            >
              HERE
            </a>
            . You can also view what Extra Life does by uniting gamers to help
            kids and give them another shot at a future.
          </p>
        </div>
      </div>
    </div>
  );
}
