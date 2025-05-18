export default function EcoModalContent() {
  return (
    <div className="p-md-3 p-2">
      <div className="nk-gap" />
      <div id="services" />
      <div className="nk-gap-2" />

      <div className="d-md-flex d-block justify-content-center single-server-details mb-2">
        {/* Rates */}
        <div className="rates-container col-12 ms-0 mt-md-0 mt-3">
          <h3 className="text-center text-danger mb-3 fw-bold">
            SERVER<span className="text-white ms-2">RATES</span>
          </h3>

          <div className="rates d-flex justify-content-center server-info-card rounded-2 p-2">
            {/* Weekday Refresh Times */}
            <div className="week col-6 mt-30 ps-0">
              <h3 className="mx-auto text-start">Mon - Thur</h3>
              <ul>
                <li className="text-white text-start">
                  Exhaustion Refresh: 8 hrs
                </li>
                <li className="text-white text-start">4X Trees & Plants</li>
                <li className="text-white text-start">Big Shovel Enabled</li>
              </ul>
            </div>

            {/* Weekend Refresh Times */}
            <div className="weekend col-6 mt-30">
              <h3 className="mx-auto text-start">Fri - Sun</h3>
              <ul>
                <li className="text-white text-start">
                  Exhaustion Refresh: 12 hrs
                </li>
                <li className="text-white text-start">4X Trees & Plants</li>
                <li className="text-white text-start">Big Shovel Enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="col-md-10 col-12 text-start mx-start mt-30 mb-0">
        ** Server Restart: 4AM CST Daily
      </p>
      <div className="nk-gap" />
    </div>
  );
}
