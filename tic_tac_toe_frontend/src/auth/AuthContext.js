import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_TTT_API || "http://localhost:3001"; // Default fallback

// PUBLIC_INTERFACE
export function useAuth() {
  /** Custom hook to access authentication context. */
  return useContext(AuthContext);
}

function getInitialAuth() {
  try {
    const user = JSON.parse(localStorage.getItem("tictactoe_user"));
    const token = localStorage.getItem("tictactoe_token");
    if (user && token) return { user, token };
  } catch {}
  return { user: null, token: null };
}

// PUBLIC_INTERFACE
function AuthContextProvider({ children }) {
  /** Provides authentication user, token, login/logout/register methods. */
  const [auth, setAuth] = useState(getInitialAuth());

  useEffect(() => {
    if (auth.user && auth.token) {
      localStorage.setItem("tictactoe_token", auth.token);
      localStorage.setItem("tictactoe_user", JSON.stringify(auth.user));
    } else {
      localStorage.removeItem("tictactoe_token");
      localStorage.removeItem("tictactoe_user");
    }
  }, [auth.user, auth.token]);

  // PUBLIC_INTERFACE
  async function login(username, password) {
    /** Login user and set token. Throws on error. */
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Invalid username or password");
    const data = await res.json();
    setAuth({ user: data.user, token: data.access_token });
    return data.user;
  }

  // PUBLIC_INTERFACE
  async function register(username, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Registration failed");
    const data = await res.json();
    setAuth({ user: data.user, token: data.access_token });
    return data.user;
  }

  // PUBLIC_INTERFACE
  function logout() {
    setAuth({ user: null, token: null });
  }

  return (
    <AuthContext.Provider value={{
      ...auth,
      login,
      register,
      logout,
      API_BASE
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
