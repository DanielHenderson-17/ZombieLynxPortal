import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { requestPasswordReset } from "../../managers/authManager";
import { Input, FormGroup, Button } from "reactstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    requestPasswordReset(email)
      .then((message) => {
        toast.success(message);
        setEmail("");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to send reset email.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form
      className={`container login-container fade-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 ${
        isVisible ? "fade-in" : "fade-start"
      }`}
      onSubmit={handleSubmit}
    >
      <img src="/images/zlglogo.png" alt="" className="col-10 mt-3 mb-3" />
      <h4>Reset Your Password</h4>
      <hr />
      <FormGroup className="mb-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormGroup>

      <Button color="primary" type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      <ToastContainer position="top-center" />
    </form>
  );
}
