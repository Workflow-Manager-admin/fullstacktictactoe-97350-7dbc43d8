import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import AuthContextProvider, { useAuth } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import GameBoardPage from "./game/GameBoardPage";
import GameHistoryPage from "./game/GameHistoryPage";
import NewGamePage from "./game/NewGamePage";
import "./App.css";

// Color palette CSS variables
// --primary: #2196f3; --secondary: #f5f5f5; --accent: #e91e63;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar" style={{
      background: "var(--primary)",
      color: "#fff",
      padding: "0.8rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div className="navbar-brand" style={{ fontWeight: "bold", fontSize: 20 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Tic Tac Toe</Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to="/games/new" className="nav-link">New Game</Link>
            <Link to="/games/history" className="nav-link">History</Link>
            <span className="nav-user" style={{ margin: "0 8px", fontWeight: "600" }}>{user.username}</span>
            <button className="btn btn-mini" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 65px)" }}>
          <Routes>
            <Route path="/" element={<LandingOrGame />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/games/new" element={<RequireAuth><NewGamePage /></RequireAuth>} />
            <Route path="/games/:gameId" element={<RequireAuth><GameBoardPage /></RequireAuth>} />
            <Route path="/games/history" element={<RequireAuth><GameHistoryPage /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AuthContextProvider>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function LandingOrGame() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Default to history for logged-in users
  return <Navigate to="/games/history" replace />;
}

function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>404: Page Not Found</h2>
      <Link to="/" className="btn btn-large" style={{ marginTop: "1.5rem" }}>Go Home</Link>
    </div>
  );
}

export default App;
