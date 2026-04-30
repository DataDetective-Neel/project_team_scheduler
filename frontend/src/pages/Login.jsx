import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [faculty_id, setFacultyId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!faculty_id.trim()) {
      setError("Faculty ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Store login state in localStorage
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("faculty_id", faculty_id);

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Smart Evaluation Scheduler</h1>
        <p className="login-subtitle">Faculty Portal</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="faculty_id">Faculty ID</label>
            <input
              type="text"
              id="faculty_id"
              value={faculty_id}
              onChange={(e) => setFacultyId(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">Demo: Use any Faculty ID and password to login</p>
      </div>
    </div>
  );
}

export default Login;
