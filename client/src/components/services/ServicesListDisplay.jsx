import "../../assets/styles/ServicesListDisplay.css";

export default function ServicesListDisplay() {
  return (
    <div className="mt-3 mb-3 pt-5 col-11 mx-auto zlg-services">
      {/* Services Header */}
      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">SERVICES</span>
        <span className="server-status-line"></span>
      </h3>

      {/* Subscription Cards */}
      <div className="row mx-0 text-white py-3 border-0 services-table-bg rounded-3">
        {/* Single Payment */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative">
            <span className="subscription-badge single-badge">
              Single Payment
            </span>
            <img
              className="col-6"
              src="/src/assets/images/normallynx.png"
              alt="Single Payment"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">One Time Payment</h4>
            <a
              href="https://www.paypal.com/paypalme/JulieannHenderson"
              className="btn btn-dark mb-3 mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paypal
            </a>
            <a
              href="https://account.venmo.com/u/Julieann-West"
              className="btn btn-dark mb-3 mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Venmo
            </a>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              <li className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#999999"
                  className="me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                </svg>
                This is a one-time donation
              </li>
              <li className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#999999"
                  className="me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                </svg>
                Discord Shoutout
              </li>
            </ul>
          </div>
        </div>
        {/* Golden Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative">
            <span className="subscription-badge golden-badge">Golden Lynx</span>
            <img
              className="col-6"
              src="/src/assets/images/goldenlynx.png"
              alt="Golden Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$4.99 / month</h4>
            <a
              href="https://zombie-lynx-gaming.tebex.io/category/subscriptions"
              className="btn btn-dark mb-3 mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe
            </a>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Golden Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "650 ZP Every Month!",
                "7 ZP Every 15 Minutes",
                "10x Ingots, 5x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-9"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#ffd700"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diamond Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative">
            <span className="subscription-badge diamond-badge">
              Diamond Lynx
            </span>
            <img
              className="col-6"
              src="/src/assets/images/diamondlynx.png"
              alt="Diamond Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$9.99 / month</h4>
            <a
              href="https://zombie-lynx-gaming.tebex.io/category/subscriptions"
              className="btn btn-dark mb-3 mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe
            </a>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Diamond Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "1300 ZP Every Month!",
                "10 ZP Every 15 Minutes",
                "15x Ingots, 7x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-9"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#00bfff"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vibranium Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative">
            <span className="subscription-badge vibranium-badge">
              Vibranium Lynx
            </span>
            <img
              className="col-6"
              src="/src/assets/images/vibraniumlynx.png"
              alt="Vibranium Lynx"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$14.99 / month</h4>
            <a
              href="https://zombie-lynx-gaming.tebex.io/category/subscriptions"
              className="btn btn-dark mb-3 mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe
            </a>
            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {[
                "Vibranium Lynx Discord Role",
                "Discord Shoutout",
                "Private Discord Channel",
                "1950 ZP Every Month!",
                "15 ZP Every 15 Minutes",
                "20x Ingots, 10x Pearls/Diamonds",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-9"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#8a2be2"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <h6 className="text-white">
        Prices are for an active 1 month subscription for Ark:SE, Ark:SA, Rust,
        and Minecraft only. A subscription earns you
      </h6>
    </div>
  );
}
