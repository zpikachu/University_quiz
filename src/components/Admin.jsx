import { useState, useEffect } from "react";
import AddQuizForm from "./AddQuizForm";
import EditQuizForm from "./EditQuizForm";
import QuizTable from "./QuizTable";
import SearchBar from "./SearchBar"; 
import QuizApp from "./QuizApp";
import "../style/Admin.css";

export default function Admin({ onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [openQuiz, setOpenQuiz] = useState(null);
  const [title, setTitle] = useState("");

  const fetchAllQuizzes = async () => {
    try {
      const res = await fetch("https://university-quiz.onrender.com/api/quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch {
      console.log("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const filteredQuizzes = searchText
    ? quizzes.filter(q =>
        q.title.toLowerCase().startsWith(searchText.toLowerCase())
      )
    : quizzes;

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchAllQuizzes();
  };

  const handleEditSuccess = () => {
    setEditingQuiz(null);
    fetchAllQuizzes();
  };

  const handleOpenQuiz = async (quiz) => {
    try {
      const res = await fetch(`https://university-quiz.onrender.com/api/quizzes/${encodeURIComponent(quiz.title)}`);
      setTitle(quiz.title);
      if (!res.ok) throw new Error("Quiz not found");
      const questions = await res.json();
      setOpenQuiz({ title: quiz.title, questions });
    } catch (err) {
      console.error("Failed to load quiz:", err);
    }
  };

  const handleCloseQuiz = () => setOpenQuiz(null);

  const formOpen = showAddForm || editingQuiz;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
    
      {/* Search bar and Logout button */}
      {!formOpen && !openQuiz && (
        <div className="i">
          <SearchBar value={searchText} onChange={handleSearchChange} />
            <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      )}

      {/* Add Quiz button centered */}
      {!formOpen && !openQuiz && (
        <button className="add-quiz-button add-quiz-center" onClick={() => setShowAddForm(true)}>
          Add Quiz
        </button>
      )}

      {openQuiz ? (
        <QuizApp questionsProp={openQuiz.questions} title={title} onClose={handleCloseQuiz} />
      ) : (
        <>
          {!formOpen && filteredQuizzes.length > 0 && (
            <QuizTable
              quizzes={filteredQuizzes}
              onEdit={quiz => setEditingQuiz(quiz)}
              fetchUpdated={fetchAllQuizzes}
              onOpen={handleOpenQuiz}
            />
          )}
          {!formOpen && filteredQuizzes.length === 0 && (
            <p>No quizzes found for "{searchText}"</p>
          )}

          {showAddForm && (
            <AddQuizForm onCancel={() => setShowAddForm(false)} onSuccess={handleAddSuccess} />
          )}

          {editingQuiz && (
            <EditQuizForm quiz={editingQuiz} onCancel={() => setEditingQuiz(null)} onSuccess={handleEditSuccess} />
          )}
        </>
      )}
    </div>
  );
}
