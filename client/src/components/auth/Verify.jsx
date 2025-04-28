import { useState } from "react";
import { resendVerificationEmail } from "../../managers/authManager";
import zlglogo from "../../assets/images/zlglogo.png";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsSending(true);
      await resendVerificationEmail(email);
      setMessage("Verification email resent! Please check your inbox.");
    } catch {
      setError("Failed to resend verification email. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="container register-container confirm-email rounded-3 p-4 shadow col-md-6 col-11 text-center"
      style={{ maxWidth: "500px", opacity: 0.95 }}
    >
      <img src={zlglogo} alt="Zombie Lynx Logo" className="col-10 mt-3 mb-3" />
      <h4 className="register-title mb-4">Confirm Your Email</h4>
      <p className="mb-3">
        Thank you for registering! Please check your email!
      </p>
      <p className="text-secondary small">
        Didn&apos;t get the email? Check your Spam folder or enter your email
        again to resend it.
      </p>

      {/* 🔥 Resend Verification Form */}
      <form onSubmit={handleResend}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={isSending}>
          {isSending ? "Sending..." : "Resend Verification Email"}
        </button>
      </form>

      {/* ✅ Success or Error Messages */}
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
