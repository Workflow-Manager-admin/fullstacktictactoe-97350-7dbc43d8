import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
function NewGamePage() {
  /** Starts a new game invitation versus another user. */
  const { token, API_BASE } = useAuth();
  const [opponent, setOpponent] = useState("");
  const [error, setError] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(ev) {
    ev.preventDefault();
    setError("");
    setInFlight(true);
    try {
      const res = await fetch(`${API_BASE}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ opponent_username: opponent })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to start new game");
      }
      const data = await res.json();
      navigate(`/games/${data.game_id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setInFlight(false);
    }
  }

  return (
    <section className="container-center" style={{ maxWidth: 400 }}>
      <h2 style={{ marginBottom: 24 }}>Start a New Game</h2>
      <form onSubmit={onSubmit} className="form-group">
        <label>
          Opponent Username
          <input type="text" value={opponent} onChange={e => setOpponent(e.target.value)} required className="input" />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn btn-large" disabled={inFlight} style={{ marginTop: "1rem", width: "100%" }}>
          {inFlight ? "Starting..." : "Start Game"}
        </button>
      </form>
    </section>
  );
}

export default NewGamePage;
