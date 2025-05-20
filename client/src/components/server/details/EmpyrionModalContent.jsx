export default function EmpyrionModalContent() {
  return (
    <div className="p-md-3 p-2">
      <div className="nk-gap" />
      <div id="services" />
      <div className="nk-gap-2" />

      <div className="d-md-flex d-block justify-content-center single-server-details mb-2">
        {/* Server Info */}
        <div className="rates-container col-12 ms-0 mt-md-0 mt-3">
          <h3 className="text-center text-danger mb-3 fw-bold">
            SERVER<span className="text-white ms-2">INFO</span>
          </h3>

          <div className="rates d-flex justify-content-center server-info-card rounded-2 p-2">
            {/* Rates */}
            <div className="week col-7 mt-30 ps-0">
              <h3 className="mx-auto text-start">Rates</h3>
              <ul>
                <li className="text-white text-start">
                  Player Progression: Normal
                </li>
                <li className="text-white text-start">
                  Degradation Speed: Normal
                </li>
                <li className="text-white text-start">
                  Radiation Temperature: Normal
                </li>
                <li className="text-white text-start">Food Consumption: Low</li>
                <li className="text-white text-start">
                  Oxygen Consumption: Low
                </li>
                <li className="text-white text-start">Amount of Ore: Normal</li>
                <li className="text-white text-start">
                  Number of Deposits: Plenty
                </li>
                <li className="text-white text-start">
                  Backpack Drop: Drop Bag Only
                </li>
              </ul>
            </div>

            {/* Mods */}
            <div className="weekend col-5 mt-30">
              <h3 className="mx-auto text-start">Mods</h3>
              <ul>
                <li className="text-white text-start">Reforged Eden</li>
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
