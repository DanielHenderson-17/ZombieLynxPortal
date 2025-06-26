import zlgLogo from "../../assets/auth/zlglogo.webp";
import { useState, useEffect } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { fetchDiscordClientId } from "../../managers/discordAuthManager";
import { validatePassword } from "../../utils/validatePassword";
import "./Login.css";
import { formatDiscordName } from "../../utils/formatDiscordName";

export default function Register() {
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
  const [passwordError, setPasswordError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

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
          console.error(discordLinked);
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
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

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
        hasAcceptedTerms,
      };

      register(newUser)
        .then((data) => {
          if (data?.message?.toLowerCase().includes("already in use")) {
            setRegistrationFailure("Email is already in use.");
          } else {
            navigate("/verify");
          }
        })
        .catch((error) => {
          setRegistrationFailure(error.message || "Registration failed.");
        });
    }
  };

  if (!discordId) {
    return (
      <div
        className={`container register-container fade-container rounded-3 p-4 shadow mt-5 col-md-6 col-11 ${
          isVisible ? "fade-in" : "fade-start"
        }`}
      >
        <img
          src={zlgLogo}
          alt="ZLG Logo"
          className="col-10 mt-3 mb-3"
          loading="lazy"
          aria-hidden="true"
        />
        <h5 className="mt-4 waiting-text">
          Waiting for Discord authentication...
        </h5>
        <p>Please complete linking your Discord account to proceed.</p>
      </div>
    );
  }

  return (
    <div className="container register-container rounded-3 p-4 shadow mt-5 col-md-6 col-11">
      <img
        src={zlgLogo}
        alt="ZLG Logo"
        className="col-10 mt-3 mb-3"
        loading="lazy"
        aria-hidden="true"
      />
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="form-control bg-dark text-white border border-secondary"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Last Name"
              className="form-control bg-dark text-white border border-secondary"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          className="form-control bg-dark text-white border border-secondary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          className={`form-control bg-dark text-white border border-secondary ${
            !!passwordError || passwordMismatch ? "is-invalid" : ""
          }`}
          value={password}
          onChange={(e) => {
            const newPassword = e.target.value;
            setPassword(newPassword);
            setPasswordMismatch(false);
            setPasswordError(validatePassword(newPassword));
          }}
        />
        {passwordError && (
          <div className="invalid-feedback d-block">{passwordError}</div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Confirm Password"
          className={`form-control bg-dark text-white border border-secondary ${
            passwordMismatch ? "is-invalid" : ""
          }`}
          value={confirmPassword}
          onChange={(e) => {
            setPasswordMismatch(false);
            setConfirmPassword(e.target.value);
          }}
        />
        {passwordMismatch && (
          <div className="invalid-feedback d-block">
            Passwords do not match!
          </div>
        )}
      </div>

      <div className="form-check mb-3 d-flex justify-content-start">
        <input
          type="checkbox"
          className="form-check-input"
          id="termsCheckbox"
          checked={hasAcceptedTerms}
          onChange={(e) => setHasAcceptedTerms(e.target.checked)}
        />
        <label
          htmlFor="termsCheckbox"
          className="form-check-label text-white ps-2 text-start"
        >
          I accept the{" "}
          <a href="/zlg-rules" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      <p
        style={{ color: "red" }}
        hidden={!registrationFailure}
        className="mb-4"
      >
        Registration Failure
      </p>
      <button
        type="submit"
        className="btn btn-primary mt-3 mb-2"
        onClick={handleSubmit}
        disabled={
          !!passwordError ||
          passwordMismatch ||
          !password ||
          !confirmPassword ||
          !hasAcceptedTerms
        }
      >
        Register
      </button>

      <p className="mb-0">
        <Link to="/login" className="text-decoration-none text-secondary">
          Already have an account?
        </Link>
      </p>
    </div>
  );
}
