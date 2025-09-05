import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import Admin from "./components/Admin";
import UserPanel from "./components/UserPanel";

export default function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check login state in localStorage
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setAdminLoggedIn(loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem("adminLoggedIn", "true");
    setAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setAdminLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* User Panel */}
        <Route path="/" element={<UserPanel />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            adminLoggedIn ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            adminLoggedIn ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
