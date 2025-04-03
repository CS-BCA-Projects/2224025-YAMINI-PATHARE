import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyLogin.css"; // Using the same CSS for consistency

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 sec
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {success && <p className="success-message">Successfully registered! Redirecting to login...</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="login-links">
        <Link to="/" className="back-home">⬅ Back to Home</Link>
        <span> | </span>
        <Link to="/login" className="signup-link">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
