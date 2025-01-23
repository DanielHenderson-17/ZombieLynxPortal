import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { Button, FormFeedback, FormGroup, Input } from "reactstrap";
import zlglogo from "../../assets/images/zlglogo.png";
import "../../assets/styles/Login.css";

export default function Register({ setLoggedInUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState();
  const [registrationFailure, setRegistrationFailure] = useState(false);

  const navigate = useNavigate();

  // Handle form submission and register user
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      };
      register(newUser).then((user) => {
        if (user) {
          setLoggedInUser(user);
          navigate("/");
        } else {
          setRegistrationFailure(true);
        }
      });
    }
  };

  return (
    <div
      className="container register-container rounded-3 p-4 shadow mt-5 col-md-6 col-11"
      style={{ maxWidth: "500px" }}
    >
      <img src={zlglogo} alt="" className="col-10 mt-3 mb-3" />
      <h4>Create a new account</h4>
      <hr />

      {/* Desktop: Side-by-side inputs for First Name and Last Name */}
      <div className="row mb-2 mt-5">
        <div className="col-12 col-md-6">
          <FormGroup>
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div className="col-12 col-md-6">
          <FormGroup>
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </FormGroup>
        </div>
      </div>

      <FormGroup className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <Input
          type="password"
          placeholder="Password"
          invalid={passwordMismatch}
          value={password}
          onChange={(e) => {
            setPasswordMismatch(false);
            setPassword(e.target.value);
          }}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <Input
          type="password"
          placeholder="Confirm Password"
          invalid={passwordMismatch}
          value={confirmPassword}
          onChange={(e) => {
            setPasswordMismatch(false);
            setConfirmPassword(e.target.value);
          }}
        />
        <FormFeedback>Passwords do not match!</FormFeedback>
      </FormGroup>

      <p
        style={{ color: "red" }}
        hidden={!registrationFailure}
        className="mb-4"
      >
        Registration Failure
      </p>
      <Button
        color="primary"
        onClick={handleSubmit}
        disabled={passwordMismatch}
        className="mt-3 mb-2"
      >
        Register
      </Button>
      <p className="mb-0">
        <Link to="/login" className="text-decoration-none text-secondary">
          Already have an account?
        </Link>
      </p>
    </div>
  );
}
