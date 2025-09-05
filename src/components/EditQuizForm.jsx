import { useState } from "react";
import "../style/EditQuizForm.css";

export default function EditQuizForm({ quiz, onCancel, onSuccess }) {
  const [title, setTitle] = useState(quiz.title);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleEditQuiz = async () => {
    try {
      const quizFile = file ? JSON.parse(await file.text()) : undefined;

      const res = await fetch(`http://localhost:5000/api/admin/quizzes/${quiz.title}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, quizFile })
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage("Error: " + text);
        return;
      }

      console.log("Quiz updated successfully"); // temporary console.log
      onSuccess();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="edit-quiz-form">
      <h3>Edit Quiz</h3>
      {message && <div className="message">{message}</div>}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="file"
        accept=".json"
        onChange={e => setFile(e.target.files[0])}
      />
      <div className="buttons">
        <button className="save-button" onClick={handleEditQuiz}>Save</button>
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
