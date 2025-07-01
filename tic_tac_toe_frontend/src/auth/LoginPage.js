import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

// PUBLIC_INTERFACE
function LoginPage() {
  /** Login form for existing users. */
  const { login } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(ev) {
    ev.preventDefault();
    setError("");
    try {
      await login(fields.username, fields.password);
      navigate("/games/history");
    } catch (e) {
      setError(e.message || "Login failed");
    }
  }

  function handleChange(ev) {
    setFields({ ...fields, [ev.target.name]: ev.target.value });
  }

  return (
    <section className="container-center" style={{ maxWidth: 380, margin: "2.5rem auto" }}>
      <h2 style={{ marginBottom: "2rem" }}>Sign In</h2>
      <form onSubmit={onSubmit} className="form-group">
        <label>Username
          <input type="text" required name="username" value={fields.username} onChange={handleChange} className="input" autoComplete="username" />
        </label>
        <label>Password
          <input type="password" required name="password" value={fields.password} onChange={handleChange} className="input" autoComplete="current-password" />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn btn-large" style={{ marginTop: "1rem", width: "100%" }}>Login</button>
      </form>
      <div style={{ marginTop: "1.2rem", color: "#555" }}>
        No account?
        <Link to="/register" style={{ color: "var(--accent)", marginLeft: 6 }}>Register</Link>
      </div>
    </section>
  );
}

export default LoginPage;
