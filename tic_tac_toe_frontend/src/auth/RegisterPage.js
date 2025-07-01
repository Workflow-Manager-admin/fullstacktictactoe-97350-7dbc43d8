import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

// PUBLIC_INTERFACE
function RegisterPage() {
  /** Registration form for new users. */
  const { register } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(ev) {
    ev.preventDefault();
    setError("");
    try {
      await register(fields.username, fields.password);
      navigate("/games/history");
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  }

  function handleChange(ev) {
    setFields({ ...fields, [ev.target.name]: ev.target.value });
  }

  return (
    <section className="container-center" style={{ maxWidth: 380, margin: "2.5rem auto" }}>
      <h2 style={{ marginBottom: "2rem" }}>Create Account</h2>
      <form onSubmit={onSubmit} className="form-group">
        <label>Username
          <input type="text" required name="username" value={fields.username} onChange={handleChange} className="input" autoComplete="username" />
        </label>
        <label>Password
          <input type="password" required name="password" value={fields.password} onChange={handleChange} className="input" autoComplete="new-password" />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn btn-large" style={{ marginTop: "1rem", width: "100%" }}>Register</button>
      </form>
      <div style={{ marginTop: "1.2rem", color: "#555" }}>
        Already have an account?
        <Link to="/login" style={{ color: "var(--accent)", marginLeft: 6 }}>Login</Link>
      </div>
    </section>
  );
}

export default RegisterPage;
