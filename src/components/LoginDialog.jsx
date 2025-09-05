import React from "react";
import "../style/LoginDialog.css";

export default function LoginDialog({ open, message, type, onClose }) {
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className={`dialog-box ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
