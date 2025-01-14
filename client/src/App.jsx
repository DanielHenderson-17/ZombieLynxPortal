import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "reactstrap";
// import NavBar from "./components/NavBar";
import ApplicationViews from "./components/ApplicationViews";
import "../src/assets/styles/App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(undefined); // Start as undefined

  useEffect(() => {
    // ✅ Try to restore the user session on page load
    tryGetLoggedInUser()
      .then((user) => {
        setLoggedInUser(user);
      })
      .catch(() => {
        setLoggedInUser(null);
      });
  }, []);

  // ✅ Show a spinner while checking for the logged-in user
  if (loggedInUser === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <>
      {/* <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> */}
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default App;
