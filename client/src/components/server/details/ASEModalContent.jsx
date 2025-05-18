export default function ASEModalContent() {
  return (
    <div className="p-md-3 p-2">
      <div className="nk-gap" />
      <div id="services" />
      <div className="nk-gap-2" />

      <div className="d-md-flex d-block justify-content-center single-server-details mb-2">
        {/* Rates */}
        <div className="rates-container col-12 ms-0 mt-md-0 mt-3">
          <h3 className="text-center text-danger mb-3 fw-bold">
            SERVER <span className="text-white ms-2">RATES</span>
          </h3>

          <div className="rates d-flex justify-content-center  server-info-card rounded-2 p-2">
            {/* Weekday Rates */}
            <div className="week col-6 mt-30 ps-0">
              <h3 className="mx-auto text-start">Mon - Thur</h3>
              <ul>
                <li className="text-white text-start">XP: 3X</li>
                <li className="text-white text-start">Taming: 6X</li>
                <li className="text-white text-start">Harvest: 3X</li>
                <li className="text-white text-start">Fishing Loot: 1.5X</li>
                <li className="text-white text-start">Baby Mature Speed: 3X</li>
                <li className="text-white text-start">Mating Interval: 0.2X</li>
                <li className="text-white text-start">Mating Speed: 3X</li>
                <li className="text-white text-start">Egg Hatch Speed: 3X</li>
                <li className="text-white text-start">Lay Egg Interval: 3X</li>
                <li className="text-white text-start">
                  Loot Crate Quality: 1X
                </li>
              </ul>
            </div>

            {/* Weekend Rates */}
            <div className="weekend col-6 mt-30">
              <h3 className="mx-auto text-start">Fri - Sun</h3>
              <ul>
                <li className="text-white text-start">XP: 5X</li>
                <li className="text-white text-start">Taming: 6X</li>
                <li className="text-white text-start">Harvest: 5X</li>
                <li className="text-white text-start">Fishing Loot: 1.5X</li>
                <li className="text-white text-start">Baby Mature Speed: 5X</li>
                <li className="text-white text-start">Mating Interval: 0.2X</li>
                <li className="text-white text-start">Mating Speed: 5X</li>
                <li className="text-white text-start">Egg Hatch Speed: 5X</li>
                <li className="text-white text-start">Lay Egg Interval: 5X</li>
                <li className="text-white text-start">
                  Loot Crate Quality: 1X
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="col-md-10 col-12 text-start mx-start mt-0 mb-0 server-restart">
        ** Server Restart: 4AM CST Daily
      </p>
      <p className="col-md-10 col-12 text-start mx-start mt-0 pt-0 server-restart">
        ** New Player Protection: 14 Days or Level 105
      </p>

      <div className="nk-gap" />
    </div>
  );
}
