import { useState, useEffect } from "react";
import { register, tryGetLoggedInUser } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { Button, FormFeedback, FormGroup, Input } from "reactstrap";
import zlglogo from "../../assets/images/zlglogo.png";
import { fetchDiscordClientId } from "../../managers/discordAuthManager";
import "../../assets/styles/Login.css";
import { formatDiscordName } from "../../utils/formatDiscordName";

export default function Register({ setLoggedInUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState();
  const [registrationFailure, setRegistrationFailure] = useState(false);
  const [discordId, setDiscordId] = useState(null);
  const [discordName, setDiscordName] = useState(null);
  const [discordImgUrl, setDiscordImgUrl] = useState(null);
  const [discordLinked, setDiscordLinked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscordClientId().then((clientId) => {
      if (!clientId) {
        console.error("Discord Client ID not found");
        return;
      }

      const discordLoginUrl =
        `https://discord.com/oauth2/authorize?client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(
          window.location.origin + "/discord-callback.html"
        )}` +
        `&response_type=token&scope=identify`;

      const discordWindow = window.open(
        discordLoginUrl,
        "DiscordLogin",
        "width=600,height=800"
      );

      const windowCheckInterval = setInterval(() => {
        if (discordWindow.closed) {
          clearInterval(windowCheckInterval);
          setTimeout(() => {
            setDiscordLinked((linked) => {
              if (!linked) navigate("/login");
              return linked;
            });
          }, 500);
        }
      }, 1000);
    });
  }, [navigate]);

  useEffect(() => {
    const handleDiscordMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      const { type, discordId, discordName, discordImgUrl } = event.data;
      if (type === "DISCORD_AUTH_SUCCESS") {
        setDiscordId(discordId);
        setDiscordName(discordName);
        setDiscordImgUrl(discordImgUrl);
        setDiscordLinked(true);
      }
    };

    window.addEventListener("message", handleDiscordMessage);

    return () => window.removeEventListener("message", handleDiscordMessage);
  }, []);

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
        discordId,
        discordName,
        discordImgUrl,
      };

      register(newUser)
        .then((data) => {
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            tryGetLoggedInUser().then((user) => {
              if (user) {
                setLoggedInUser(user);
                navigate("/member");
              } else {
                setRegistrationFailure(true);
              }
            });
          } else {
            setRegistrationFailure(true);
          }
        })
        .catch((error) => {
          console.error("Registration error:", error);
          setRegistrationFailure(true);
        });
    }
  };

  if (!discordId) {
    return (
      <div
        className="container register-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 text-center"
        style={{ maxWidth: "500px", opacity: 0.6 }}
      >
        <img src={zlglogo} alt="" className="col-10 mt-3 mb-3" />
        <h5 className="mt-4 waiting-text">
          Waiting for Discord authentication...
        </h5>
        <p>Please complete linking your Discord account to proceed.</p>
      </div>
    );
  }

  return (
    <div className="container register-container rounded-3 p-4 shadow mt-5 col-md-6 col-11">
      <img src={zlglogo} alt="" className="col-10 mt-3 mb-3" />
      <h4 className="register-title">Create a new account for</h4>
      <div className="d-flex justify-content-center align-items-center mb-2 register-user">
        <img
          src={discordImgUrl}
          alt={discordName}
          className="rounded-circle mb-2 me-2"
          width="30"
        />
        <h4>{formatDiscordName(discordName)}</h4>
      </div>
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
