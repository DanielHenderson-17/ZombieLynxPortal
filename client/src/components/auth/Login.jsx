import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../managers/authManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [resendStatus, setResendStatus] = useState({ success: "", error: "" });

  const location = useLocation();
  const from = location.state?.from?.pathname || "/member";
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((result) => {
      if (result?.error) {
        if (result.error.includes("verify your email")) {
          setShowUnverifiedModal(true);
        } else {
          setFailedLogin(true);
        }
      } else {
        setLoggedInUser(result);
        setShowLoginAnimation(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 3000);
      }
    });
  };

  const handleResendVerification = () => {
    setResendStatus({ success: "", error: "" });

    fetch("/api/Auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.text())
      .then((msg) => {
        setShowUnverifiedModal(false);
        setResendStatus({ success: msg, error: "" });
        toast.success("Verification email sent!");
      })
      .catch(() => {
        setResendStatus({
          success: "",
          error: "Failed to resend verification email.",
        });
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (showLoginAnimation) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <img
          src="/images/runninglynx.gif"
          alt="Logging in..."
          className="running-lynx"
        />
      </div>
    );
  }

  return (
    <>
      <form
        className={`container login-container fade-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 ${
          isVisible ? "fade-in" : "fade-start"
        }`}
        onSubmit={handleSubmit}
      >
        <img
          src="/images/zlglogo.png"
          alt="ZLG Logo"
          className="col-10 mt-3 mb-3"
        />
        <h4>Welcome Back</h4>
        <hr />

        <div className="mb-4">
          <input
            type="text"
            className={`form-control ${failedLogin ? "is-invalid" : ""}`}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setFailedLogin(false);
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className={`form-control ${failedLogin ? "is-invalid" : ""}`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setFailedLogin(false);
              setPassword(e.target.value);
            }}
          />
        </div>

        {failedLogin && (
          <div className="text-danger text-center mb-3">
            Incorrect email or password.
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-3 mb-4 w-100">
          Login
        </button>

        <p className="mb-2 text-center">
          <Link
            to="/forgot-password"
            className="text-decoration-none text-secondary"
          >
            Forgot your password?
          </Link>
        </p>

        <p className="mb-0 text-center">
          <Link to="/register" className="text-decoration-none text-secondary">
            Not signed up? Register here
          </Link>
        </p>
      </form>

      {showUnverifiedModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header">
                <h5 className="modal-title">Email Not Verified</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => {
                    setShowUnverifiedModal(false);
                    setResendStatus({ success: "", error: "" });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Your account exists but hasn&apos;t been verified yet. Please
                  check your inbox or click below to resend the verification
                  email.
                </p>
                {resendStatus.success && (
                  <div className="text-success mt-2">
                    {resendStatus.success}
                  </div>
                )}
                {resendStatus.error && (
                  <div className="text-danger mt-2">{resendStatus.error}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUnverifiedModal(false);
                    setResendStatus({ success: "", error: "" });
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
