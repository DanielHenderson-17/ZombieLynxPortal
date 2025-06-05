import { useState } from "react";
import { getCategoryBadgeClass } from "../../utils/serverCategoryUtils";
import { servers } from "../../utils/serversData";
import ASEModalContent from "./details/ASEModalContent";
import ASAModalContent from "./details/ASAModalContent";
import MinecraftModalContent from "./details/MinecraftModalContent";
import EcoModalContent from "./details/EcoModalContent";
import EmpyrionModalContent from "./details/EmpyrionModalContent";
import "./ServerListDisplay.css";

export default function ServerListDisplay() {
  const [activeServer, setActiveServer] = useState(servers[0]);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const modalComponents = {
    1: ASEModalContent,
    2: ASAModalContent,
    3: EcoModalContent,
    4: MinecraftModalContent,
    5: EmpyrionModalContent,
    // etc.
  };

  const ModalContentComponent = modalComponents[activeServer.id];

  return (
    <div className="zlg-servers" id="ServerListDisplay" data-aos="fade-up">
      <div className="mt-3 mb-5 pb-5 zlg-server-list col-11 mx-auto">
        <h3 className="text-start text-danger server-status-title mb-3">
          ZLG <span className="text-white ms-2">SERVERS</span>
          <span className="server-status-line"></span>
        </h3>

        {/* Flex direction is row by default, switches to column on small screens */}
        <div className="d-flex flex-md-row flex-column server-list h-100">
          {/* Server List */}
          <div className="col-md-6 col-12 server-list-selections">
            <ul className="list-group text-start rounded-start-2 rounded-end-0 border-start border-danger border-5">
              {servers.map((server) => (
                <li
                  key={server.id}
                  className={`list-group-item flex-grow-1 d-flex p-1 text-white border-0 my-1 my-md-0 ${
                    activeServer.id === server.id
                      ? "active bg-danger list-group-item-active"
                      : ""
                  }`}
                  onClick={() => setActiveServer(server)}
                >
                  <img
                    src={server.thumbImg}
                    alt={server.title}
                    className="img-fluid me-2 col-3 rounded-2 server-thumb"
                  />
                  <div className="col-10 my-auto mx-1 pe-1">
                    <p className="m-0 fw-bold text-white pt-1 game-title">
                      {server.title}
                    </p>
                    <p
                      className={`m-0 pe-md-3 pe-0 server-description-text col-10 col-md-12 d-none d-md-block ${
                        activeServer.id === server.id ? "text-white" : ""
                      }`}
                    >
                      {server.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Server Details */}
          <div className="col-md-6 col-12 active-server-details rounded-end-2 rounded-start-0 mt-md-0 mt-3">
            <div className="text-center">
              <img
                src={activeServer.mainImg}
                alt={activeServer.title}
                className="img-fluid mb-4 col-12 rounded-end-2"
              />
              <div className="ps-3">
                <div className="d-flex justify-content-between">
                  <h4 className="text-white text-start col-md-8 col-6 game-title2 fw-bold my-auto">
                    {activeServer.title}
                  </h4>
                  <span
                    className={`badge rounded-start-2 col-md-4 col-6 rounded-end-0 my-auto py-2 ${getCategoryBadgeClass(
                      activeServer.category
                    )}`}
                  >
                    {activeServer.category}
                  </span>
                </div>

                <p className="mt-3 server-description-text text-start pe-2 mb-0">
                  {activeServer.description}
                </p>
                <div className="text-end pe-2 mb-2 pb-1">
                  <button
                    className="btn btn-outline-light mt-2"
                    onClick={() => setShowInfoModal(true)}
                  >
                    Server Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInfoModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div
              className="modal-dialog modal-dialog-centered modal-dialog-scrollable zlg-extra-wide-modal"
              role="document"
            >
              <div className="modal-content bg-dark text-white server-info-modal border border-black shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title">{activeServer.title}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowInfoModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {ModalContentComponent && <ModalContentComponent />}
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowInfoModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: modal backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
