import React from "react";
import "../style/UserTable.css";

export default function UserTable({ quizzes, onOpen }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((quiz) => (
          <tr key={quiz.title}>
            <td>{quiz.title}</td>
            <td>
              <button className="action-btn" onClick={() => onOpen(quiz)}>Open</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
