import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (!code) {
      setStatus("error");
      setMessage("Invalid or missing verification code.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/Auth/verify-email?code=${code}`, {
          method: "POST",
        });

        if (response.ok) {
          setStatus("success");
          setMessage(
            "✅ Your email has been successfully verified! You can now log in."
          );

          setTimeout(() => navigate("/login"), 4000);
        } else {
          const data = await response.text();
          setStatus("error");
          setMessage(data || "Verification failed. Please try again.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          "An error occurred during verification. Please try again later."
        );
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="mt-5 pt-5">
      <div
        className="container register-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 text-center"
        style={{ maxWidth: "500px", opacity: 0.95 }}
      >
        <img
          src="/images/zlglogo.png"
          alt="Zombie Lynx Logo"
          className="col-10 mt-3 mb-3"
        />
        <h4 className="register-title mb-4">Email Verification</h4>

        {status === "loading" && (
          <p className="text-muted">Verifying your email, please wait...</p>
        )}

        {status === "success" && (
          <div className="alert alert-success">{message}</div>
        )}

        {status === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
      </div>
    </div>
  );
}
