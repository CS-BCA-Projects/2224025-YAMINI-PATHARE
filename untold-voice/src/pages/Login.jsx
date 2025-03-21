import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // ✅ Correct Context Import
import "./MyLogin.css"; // ✅ Ensure CSS is applied

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext); // ✅ Fetch setUser from Context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password },
        { withCredentials: true } // ✅ Ensure cookies are sent
      );

      // ✅ Save user in Context & LocalStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/myblogs"); // ✅ Redirect after successful login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* ✅ Show error messages if login fails */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="login-links">
        <Link to="/" className="back-home">⬅ Back to Home</Link>
        <span> | </span>
        <Link to="/register" className="signup-link">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
