import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import { Button, FormFeedback, FormGroup, Input } from "reactstrap";
import zlglogo from "../../assets/images/zlglogo.png";
import "../../assets/styles/Login.css";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  // Handle form submission and login user
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((user) => {
      if (!user) {
        setFailedLogin(true);
      } else {
        setLoggedInUser(user);
        navigate("/member");
      }
    });
  };

  return (
    <div
      className="container login-container rounded-3 p-4 shadow mt-5 col-md-6 col-11"
      style={{ maxWidth: "500px" }}
    >
      <img src={zlglogo} alt="" className="col-10 mt-3 mb-3" />
      <h4>Welcome Back</h4>
      <hr />

      <FormGroup className="mb-4">
        <Input
          type="text"
          placeholder="Email"
          invalid={failedLogin}
          value={email}
          onChange={(e) => {
            setFailedLogin(false);
            setEmail(e.target.value);
          }}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <Input
          type="password"
          placeholder="Password"
          invalid={failedLogin}
          value={password}
          onChange={(e) => {
            setFailedLogin(false);
            setPassword(e.target.value);
          }}
        />
        <FormFeedback>Login failed.</FormFeedback>
      </FormGroup>

      <Button color="primary" onClick={handleSubmit} className="mt-3 mb-4">
        Login
      </Button>

      <p className="mb-0">
        <Link to="/register" className="text-decoration-none text-secondary">
          Not signed up? Register here
        </Link>
      </p>
    </div>
  );
}
