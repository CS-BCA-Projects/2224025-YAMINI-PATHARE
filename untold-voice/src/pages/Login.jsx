import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // ✅ Correct Context Import
import "../styles/MyLogin.css"; // ✅ Ensure CSS is applied

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

    console.log("Sending login request:", { email, password });
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);


    try {
        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
            { email, password },
            { withCredentials: true }
        );

        console.log("Login successful:", data);

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/myblogs");
    } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
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
