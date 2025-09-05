import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import "../style/QuizTable.css";

export default function QuizTable({ quizzes, onEdit, fetchUpdated, onOpen }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleDeleteClick = (quiz) => {
    setSelectedQuiz(quiz);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`https://university-quiz.onrender.com/api/admin/quizzes/${selectedQuiz.title}`, {
        method: "DELETE"
      });
      setConfirmOpen(false);
      setSelectedQuiz(null);
      fetchUpdated(); // refresh table
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.title}>
              <td>{quiz.title}</td>
              <td>
                <button className="action-btn" onClick={() => onEdit(quiz)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(quiz)}>Delete</button>
                <button className="open-btn" onClick={() => onOpen(quiz)}>Open</button> {/* New Open button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${selectedQuiz?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
