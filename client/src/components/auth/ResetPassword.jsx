import zlgLogo from "../../assets/auth/zlglogo.webp";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../managers/authManager";
import { Input, FormGroup, Button, FormFeedback } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validatePassword } from "../../utils/validatePassword";
import "./Login.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing.");
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      setLoading(false);
      return;
    }

    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      toast.error(error);
      setLoading(false);
      return;
    }

    resetPassword(token, newPassword, confirmPassword)
      .then((msg) => {
        toast.success(msg);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        toast.error(err.message || "Reset failed.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        className={`container login-container fade-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 ${
          isVisible ? "fade-in" : "fade-start"
        }`}
        onSubmit={handleSubmit}
      >
        <img
          src={zlgLogo}
          alt="ZLG Logo"
          className="col-10 mt-3 mb-3"
          loading="lazy"
          aria-hidden="true"
        />
        <h4>Set a New Password</h4>
        <hr />

        <FormGroup className="mb-4">
          <Input
            type="password"
            placeholder="New Password"
            className="bg-dark text-white border border-secondary"
            value={newPassword}
            invalid={!!passwordError || passwordMismatch}
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);
              setPasswordError(validatePassword(value));
              setPasswordMismatch(false);
            }}
          />
          {passwordError && (
            <FormFeedback className="d-block">{passwordError}</FormFeedback>
          )}
        </FormGroup>

        <FormGroup className="mb-4">
          <Input
            type="password"
            placeholder="Confirm Password"
            className="bg-dark text-white border border-secondary"
            value={confirmPassword}
            invalid={passwordMismatch}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMismatch(false);
            }}
          />
          {passwordMismatch && (
            <FormFeedback className="d-block">
              Passwords do not match!
            </FormFeedback>
          )}
        </FormGroup>

        <Button
          color="primary"
          type="submit"
          disabled={loading || !token || !!passwordError || passwordMismatch}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <ToastContainer position="top-center" />
    </>
  );
}
