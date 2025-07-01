import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./GameBoardPage.css";

// Board cell rendering
function Cell({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled || value}
      aria-label={value ? (value === "X" ? "X" : "O") : "Empty"}
    >
      {value}
    </button>
  );
}

// Board layout
function GameBoard({ board, onCellClick, disabled }) {
  return (
    <div className="ttt-board">
      {board.flat().map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(Math.floor(idx / 3), idx % 3)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameBoardPage() {
  /**
   * Displays the Tic Tac Toe game, player info, winner, and move controls.
   */
  const { gameId } = useParams();
  const { user, token, API_BASE } = useAuth();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [moveInFlight, setMoveInFlight] = useState(false);

  // Fetch game state
  const fetchGame = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        headers: { "Authorization": "Bearer " + token }
      });
      if (!res.ok) throw new Error("Failed to fetch game.");
      const data = await res.json();
      setGame(data);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load game.");
    }
  }, [API_BASE, gameId, token]);

  useEffect(() => {
    fetchGame(); // initial
    const interval = setInterval(fetchGame, 2000); // Poll every 2s for updates
    return () => clearInterval(interval);
  }, [fetchGame]);

  // Make a move
  async function onCellClick(row, col) {
    if (!game || moveInFlight) return;
    setMoveInFlight(true);
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ row, col })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Invalid move");
      }
      await fetchGame();
      setError("");
    } catch (e) {
      setError(e.message || "Failed to make move.");
    } finally {
      setMoveInFlight(false);
    }
  }

  // Helper: current turn's symbol
  const currentTurn = game?.players?.[game.turn % 2]?.symbol;
  const youAre = game && user && game.players.find(p => p.username === user.username)?.symbol;
  const opponent = game && game.players.find(p => p.username !== user.username);

  return (
    <div className="container-center" style={{
      maxWidth: 370, margin: "2rem auto 0", display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      {game ? (
        <>
          <div className="ttt-players" style={{ marginBottom: 10 }}>
            <div className="ttt-player ttt-you">
              <span className="sym" style={{ color: "var(--primary)" }}>{youAre || "?"}</span>{" "}
              {user.username} (You)
            </div>
            <div className="ttt-vs">vs</div>
            <div className="ttt-player ttt-opponent">
              <span className="sym" style={{ color: "var(--accent)" }}>{opponent?.symbol || "?"}</span>{" "}
              {opponent?.username || "Pending"}
            </div>
          </div>

          <GameBoard board={game.board} onCellClick={onCellClick} disabled={game.winner != null || moveInFlight || game.turn_username !== user.username} />

          <div className="game-actions" style={{ marginTop: 30 }}>
            {!game.winner && (
              <div className="turn-info" style={{ fontWeight: "500" }}>
                {game.turn_username === user.username
                  ? "Your turn"
                  : game.winner === null
                  ? `Waiting for ${game.turn_username}...`
                  : ""}
              </div>
            )}
            {game.winner && (
              <div className="winner-info" style={{ fontSize: 20, margin: "1rem 0", color: "green", fontWeight: "bold" }}>
                {game.winner === "draw"
                  ? "It's a draw!"
                  : (game.players.find(p => p.symbol === game.winner)?.username === user.username
                      ? "🎉 You win!"
                      : `Winner: ${game.players.find(p => p.symbol === game.winner)?.username}`)}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>Loading game...</div>
      )}
      {error && <div className="error-message" style={{ marginTop: 18 }}>{error}</div>}
    </div>
  );
}

export default GameBoardPage;
