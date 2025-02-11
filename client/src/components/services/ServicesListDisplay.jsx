import { useState } from "react";
import servicesData from "../../utils/zlgServices";
import "../../assets/styles/ServicesListDisplay.css";
import { getBulletColor } from "../../utils/bulletColor.js";

export default function ServicesListDisplay() {
  const services = ["ArkSE", "ArkSA", "Minecraft"];
  const [activeService, setActiveService] = useState(services[0]);
  const servicesDataObject = servicesData();

  const serviceNameMap = {
    ArkSE: "ARK:SE",
    ArkSA: "ARK:SA",
    Minecraft: "MINECRAFT",
  };
  return (
    <div className="mb-5">
      {/* Services Header */}
      <h3 className="text-start text-danger server-status-title mb-3">
        ZLG <span className="text-white ms-2">SERVICES</span>
        <span className="server-status-line"></span>
      </h3>

      {/* Extra Life */}
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

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mt-5 d-flex justify-content-between col-12 border-0">
        {services.map((service) => (
          <li
            key={service}
            className="nav-item col server-status-tab mx-1 rounded-2 text-center fw-bold"
          >
            <button
              className={`nav-link service-link text-white col-12 border-0 ${
                activeService === service ? "active" : ""
              }`}
              onClick={() => setActiveService(service)}
            >
              {serviceNameMap[service]}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-0 mx-1">
        {services.map((service) => (
          <div
            key={service}
            className={`tab-pane  ${
              activeService === service ? "show active" : "fade"
            }`}
            id={service}
          >
            <section
              id={`${service}Services`}
              className="text-white mb-5 py-3 border-0 services-table-bg rounded-bottom-3 "
            >
              <div className="services-grid row mx-0">
                {servicesDataObject[service].subscriptions.map((sub) => (
                  <div className="col-md-6 col-lg-3 p-2" key={sub.id}>
                    <div className="text-center price-card rounded-3 mt-2 mb-4 p-3">
                      <img className="w-50" src={sub.image} alt={sub.name} />
                      <h4 className="text-center">
                        {sub.price || "One Time Payment"}
                      </h4>
                      {sub.links.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          className="btn btn-dark mb-3 mx-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                        </a>
                      ))}
                      <h5>Additional Benefits</h5>
                      {/* <h6 className="text-center mt-2">{sub.description}</h6> */}
                      <ul className="text-start align-items-center p-0">
                        {sub.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="d-flex align-items-center mb-2 "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill={getBulletColor(sub.id)}
                              className="me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path>
                            </svg>
                            <span className="text-start">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
