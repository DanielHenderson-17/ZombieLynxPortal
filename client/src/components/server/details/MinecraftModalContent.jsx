export default function MinecraftModalContent() {
  return (
    <div className="p-md-3 p-2">
      <div className="nk-gap" />
      <div id="services" />
      <div className="nk-gap-2" />

      <div className="d-md-flex d-block justify-content-center single-server-details mb-2">
        {/* Rates */}
        <div className="rates-container col-12 ms-0 mt-md-0 mt-3">
          <h3 className="text-center text-danger mb-3 fw-bold">
            SERVER <span className="text-white ms-2">ROOMS</span>
          </h3>

          <div className="d-flex justify-content-center server-info-card rounded-2 p-2">
            {/* Weekday Rates */}
            <div className="col-12 ps-0">
              <ul className="d-flex justify-content-around p-0 list-unstyled mb-0 flex-wrap">
                <li className="text-white">SkyBlock</li>
                <li className="text-white">OneBlock</li>
                <li className="text-white">Creative</li>
                <li className="text-white">Survival</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="col-md-10 col-12 text-start mx-start mt-0 mb-0 server-restart">
        ** Server Restart: 4AM CST Daily
      </p>

      <div className="nk-gap" />
    </div>
  );
}
