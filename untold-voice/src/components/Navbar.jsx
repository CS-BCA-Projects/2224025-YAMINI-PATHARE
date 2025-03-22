import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize navigation

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // Clear user context
      navigate("/"); // Redirect to Home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        {/* Website Name */}
        <Link className="navbar-brand fw-bold" to="/">
          Untold Voice
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {/* If user is logged in, show Logout & Home */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold px-3" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger fw-semibold px-3" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold px-3" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



