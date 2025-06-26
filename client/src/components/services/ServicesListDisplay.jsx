import "./ServicesListDisplay.css";

import normalLynx from "../../assets/services/normallynx.webp";
import goldenLynx from "../../assets/services/goldenlynx.webp";
import diamondLynx from "../../assets/services/diamondlynx.webp";
import vibraniumLynx from "../../assets/services/vibraniumlynx.webp";

export default function ServicesListDisplay() {
  return (
    <div
      className="mt-3 mb-3 pt-5 col-11 mx-auto zlg-services"
      data-aos="fade-up"
    >
      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">SERVICES</span>
        <span className="server-status-line"></span>
      </h3>

      <div className="row mx-0 text-white py-md-3 py-0 border-0 services-table-bg rounded-3">
        {/* Single Payment */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative single-border">
            <span className="subscription-badge single-badge">
              Single Payment
            </span>
            <img
              className="col-6"
              src={normalLynx}
              alt="Single Payment"
              loading="lazy"
              aria-hidden="true"
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
              <li className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11">
                {/* SVG here */}
                This is a one-time donation
              </li>
              <li className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11">
                {/* SVG here */}
                Discord Shoutout
              </li>
            </ul>
          </div>
        </div>

        {/* Golden Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative golden-border">
            <span className="subscription-badge golden-badge">Golden Lynx</span>
            <img
              className="col-6"
              src={goldenLynx}
              alt="Golden Lynx"
              loading="lazy"
              aria-hidden="true"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$4.99 / month</h4>
            <a
              href="https://zlg.gg/shop"
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
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  {/* SVG here */}
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diamond Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative diamond-border">
            <span className="subscription-badge diamond-badge">
              Diamond Lynx
            </span>
            <img
              className="col-6"
              src={diamondLynx}
              alt="Diamond Lynx"
              loading="lazy"
              aria-hidden="true"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$9.99 / month</h4>
            <a
              href="https://zlg.gg/shop"
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
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  {/* SVG here */}
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vibranium Lynx */}
        <div className="col-md-6 col-lg-3 p-1">
          <div className="text-center price-card rounded-3 mt-2 mb-md-4 mb-2 p-3 position-relative vibranium-border">
            <span className="subscription-badge vibranium-badge">
              Vibranium Lynx
            </span>
            <img
              className="col-6"
              src={vibraniumLynx}
              alt="Vibranium Lynx"
              loading="lazy"
              aria-hidden="true"
            />
            <h4 className="text-center fs-5 mt-2 mb-3">$14.99 / month</h4>
            <a
              href="https://zlg.gg/shop"
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
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                >
                  {/* SVG here */}
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <h6 className="text-secondary fs-6 pb-md-0 pb-5 mb-md-0 mb-5 services-legal">
        <i>
          Prices are for an active 1 month subscription for Ark:SE, Ark:SA,
          Rust, and Minecraft only.
        </i>
        <i className="d-block">
          All purchases are donation only and are non refundable.
        </i>
      </h6>
    </div>
  );
}
