import { useState } from "react";
import "../style/AddQuizForm.css";

export default function AddQuizForm({ onCancel, onSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddQuiz = async () => {
    if (!title || !file) {
      setMessage("Please enter title and select JSON file.");
      return;
    }

    try {
      const text = await file.text();
      const quizJSON = JSON.parse(text);

      const res = await fetch("http://localhost:5000/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, quizFile: quizJSON })
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage("Error: " + text);
        return;
      }

      console.log("Quiz added successfully"); // temporary
      onSuccess();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="add-quiz-form-container">
      <h3>Add Quiz</h3>
      {message && <div className="add-quiz-form-message">{message}</div>}
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="add-quiz-form-input"
      />
      <input
        type="file"
        accept=".json"
        onChange={e => setFile(e.target.files[0])}
        className="add-quiz-form-input"
      />
      <div className="add-quiz-form-buttons">
        <button onClick={handleAddQuiz}>Add</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
