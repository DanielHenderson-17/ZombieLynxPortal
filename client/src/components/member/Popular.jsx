import { useNavigate } from "react-router-dom";
import tierOne from "../../assets/images/tierOne.png";
import tierTwo from "../../assets/images/tierTwo.png";
import tierThree from "../../assets/images/tierThree.png";
import zlgCoin from "../../assets/images/zlgCoin.png";

export default function Popular() {
  const navigate = useNavigate();

  return (
    <div className="shop-popular col-7 d-none d-md-flex justify-content-center align-items-center mt-4 px-5">
      <div className="card p-1 border-0">
        <div className="card-body p-1">
          <img src={tierOne} alt="" />
          <p className="card-text mb-1 mt-3 fs-6">
            <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
            1100
          </p>
          <button
            className="btn btn-success w-50"
            onClick={() => navigate("/shop")}
          >
            Buy
          </button>
        </div>
      </div>

      <div className="card p-1 mx-3 card-back border-0">
        <div className="card-body p-1">
          <img src={tierTwo} alt="" />
          <p className="card-text mb-1 mt-3 fs-6">
            <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
            4600
          </p>
          <button
            className="btn btn-success w-50"
            onClick={() => navigate("/shop")}
          >
            Buy
          </button>
        </div>
      </div>

      <div className="card p-1 border-0">
        <div className="card-body p-1">
          <img src={tierThree} alt="" />
          <p className="card-text mb-1 mt-3 fs-6">
            <img src={zlgCoin} alt="" className="zlg-coin2 me-1" />
            12000
          </p>
          <button
            className="btn btn-success w-50"
            onClick={() => navigate("/shop")}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
