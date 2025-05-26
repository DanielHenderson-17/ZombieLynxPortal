export default function Subscriptions({ subscriptions, addItem, toast }) {
  return (
    <div className="row mx-0 text-white py-md-3 py-0 border-0 services-table-bg rounded-3">
      {subscriptions.map((pkg) => (
        <div key={pkg.id} className="col-md-6 col-lg-4 p-1">
          <div
            className={`text-center price-card rounded-3 mt-2 mb-4 p-3 position-relative ${
              pkg.name.toLowerCase().includes("gold")
                ? "golden-border"
                : pkg.name.toLowerCase().includes("diamond")
                ? "diamond-border"
                : "vibranium-border"
            }`}
          >
            <span
              className={`subscription-badge ${
                pkg.name.toLowerCase().includes("gold")
                  ? "golden-badge"
                  : pkg.name.toLowerCase().includes("diamond")
                  ? "diamond-badge"
                  : "vibranium-badge"
              }`}
            >
              {pkg.name.includes("Golden")
                ? "Golden Lynx"
                : pkg.name.includes("Diamond")
                ? "Diamond Lynx"
                : "Vibranium Lynx"}
            </span>
            <img className="col-6" src={pkg.image} alt={pkg.name} />
            <h4 className="text-center fs-5 mt-2 mb-3">
              ${pkg.total_price} / month
            </h4>
            <button
              className="btn btn-danger mb-3 mx-2"
              onClick={() => {
                addItem(pkg, "subscription");
                toast.success(`${pkg.name} added to cart!`);
              }}
            >
              Subscribe
            </button>

            <h5>Additional Benefits</h5>
            <ul className="text-start align-items-center p-0">
              {pkg.description
                .replace(/<\/?p>/g, "")
                .split(/<br\s*\/?>/i)
                .filter((line) => line.trim().length > 0)
                .map((benefit, index) => (
                  <li
                    key={index}
                    className="d-flex align-items-center mb-2 justify-content-start col-md-12 col-11"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={
                        pkg.name.toLowerCase().includes("gold")
                          ? "#ffd700"
                          : pkg.name.toLowerCase().includes("diamond")
                          ? "#00bfff"
                          : "#8a2be2"
                      }
                      className="me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                    </svg>
                    {benefit.trim()}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
