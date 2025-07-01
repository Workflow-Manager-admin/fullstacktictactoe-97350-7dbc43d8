import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function GameHistoryPage() {
  /**
   * Displays history/list of games for the current user.
   */
  const { token, API_BASE, user } = useAuth();
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ played: 0, won: 0, lost: 0, draw: 0 });

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(`${API_BASE}/games/history`, {
          headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setGames(data.games || []);
        setError("");

        // Stats calculation
        let played = data.games.length;
        let won = 0, lost = 0, draw = 0;
        data.games.forEach(g => {
          if (g.winner === "draw") draw++;
          else if (g.winner && g.players.find(p => p.username === user.username && p.symbol === g.winner)) won++;
          else if (g.winner) lost++;
        });
        setStats({ played, won, lost, draw });

      } catch (e) {
        setError(e.message || "Error loading history");
      }
    }
    fetchGames();
  }, [API_BASE, token, user.username]);

  return (
    <div className="container" style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: 6 }}>Game History</h2>
      <div className="stats-bar" style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div>Played: <b>{stats.played}</b></div>
        <div>Won: <span style={{ color: "green" }}><b>{stats.won}</b></span></div>
        <div>Draw: <b>{stats.draw}</b></div>
        <div>Lost: <span style={{ color: "var(--accent)" }}><b>{stats.lost}</b></span></div>
      </div>
      {games.length > 0 ? (
        <div className="game-history-list">
          {games.map(g => (
            <div key={g.game_id} className="game-history-row" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9fb",
              borderRadius: 7, margin: "8px 0", padding: "10px 15px", boxShadow: "0 1px 1px #ececec"
            }}>
              <div>
                <b>{g.players.map(p => (p.username === user.username) ? "You" : p.username).join(" vs ")}</b>
                {g.winner && <span style={{ marginLeft: 12, color: g.winner === "draw" ? "#888" : g.players.find(p => p.username === user.username && p.symbol === g.winner) ? "green" : "var(--accent)", fontWeight: "bold" }}>{(g.winner === "draw" ? "Draw" : (g.players.find(p => p.username === user.username && p.symbol === g.winner) ? "Won" : "Lost"))}</span>}
              </div>
              <Link className="btn btn-mini" to={`/games/${g.game_id}`} style={{ fontSize: 12 }}>View</Link>
            </div>
          ))}
        </div>
      ) : (
        <div>{error || "No games found."}</div>
      )}
    </div>
  );
}

export default GameHistoryPage;

