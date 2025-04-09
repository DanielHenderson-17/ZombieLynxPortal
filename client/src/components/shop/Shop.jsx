import { useEffect, useState } from "react";
import { getPackages } from "../../managers/tebexManager";
import "../../assets/styles/Shop.css";

export default function Shop() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [allPackages, setAllPackages] = useState([]);

  useEffect(() => {
    getPackages()
      .then((res) => {
        if (res?.data) {
          setAllPackages(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load Tebex packages:", err);
      });
  }, []);

  const filteredPackages = allPackages.filter((pkg) => pkg.type === activeTab);

  return (
    <div className="container mt-4">
      <h1 className="text-white text-center mb-4">ZLG Shop</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "subscription" ? "active" : ""
            }`}
            onClick={() => setActiveTab("subscription")}
          >
            Subscriptions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "single" ? "active" : ""}`}
            onClick={() => setActiveTab("single")}
          >
            Buy Points
          </button>
        </li>
      </ul>

      {/* Package Grid */}
      <div className="row justify-content-center">
        {filteredPackages.map((pkg) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={pkg.id}>
            <div className="card h-100">
              <img src={pkg.image} className="card-img-top" alt={pkg.name} />
              <div className="card-body">
                <h5 className="card-title">{pkg.name}</h5>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
                <p className="fw-bold">Price: ${pkg.total_price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
