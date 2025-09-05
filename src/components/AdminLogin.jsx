import { useState } from "react";
import LoginDialog from "./LoginDialog";
import "../style/AdminLogin.css";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialog, setDialog] = useState({ open: false, message: "", type: "error" });

  const handleLogin = async () => {
    if (!username || !password) {
      setDialog({ open: true, message: "Please enter both username and password", type: "error" });
      return;
    }
   
    
    try {
      const res = await fetch("https://university-quiz.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDialog({ open: true, message: data.error || "Login failed", type: "error" });
        return;
      }

      setDialog({ open: true, message: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => onLoginSuccess(), 1200);
    } catch (err) {
      setDialog({ open: true, message: "Error: " + err.message, type: "error" });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <LoginDialog
        open={dialog.open}
        message={dialog.message}
        type={dialog.type}
        onClose={() => setDialog({ ...dialog, open: false })}
      />
    </div>
  );
}
