import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./MyLogin.css"; // Same CSS use ho raha hai

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext); // Context se setUser le rahe hain
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      // **UserContext Me Save Karna**
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // LocalStorage me save karo

      navigate("/profile"); // Login ke baad profile page pe redirect ho
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
