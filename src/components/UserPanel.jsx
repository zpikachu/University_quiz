import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import SearchBar from "./SearchBar";
import QuizApp from "./QuizApp";
import "../style/UserPanel.css";

export default function UserPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openQuiz, setOpenQuiz] = useState(null);
  const [title,setTitle]=useState("");
  // Fetch all quizzes
  const fetchAllQuizzes = async () => {
    try {
      const res = await fetch(`https://university-quiz.onrender.com/api/quizzes`);
    
      const data = await res.json();
      setQuizzes(data);
    } catch {
      console.log("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredQuizzes = searchText
    ? quizzes.filter(q =>
        q.title.toLowerCase().startsWith(searchText.toLowerCase())
      )
    : quizzes;

  // Open quiz: fetch questions from backend
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

  const handleCloseQuiz = () => {
    setOpenQuiz(null);
  };

  return (
    <div className="user-panel-container">
      {openQuiz ? (
        // Conditional rendering: show QuizApp only when a quiz is opened
        <QuizApp questionsProp={openQuiz.questions} title={title} onClose={handleCloseQuiz} />
      ) : (
        <>
          <h1 className="user-panel-title">Available Quizzes</h1>

          <SearchBar
            value={searchText}
            onChange={handleSearchChange}
          />

          {filteredQuizzes.length > 0 ? (
            <UserTable quizzes={filteredQuizzes} onOpen={handleOpenQuiz} />
          ) : (
            <p>No quizzes found for "{searchText}"</p>
          )}
        </>
      )}
    </div>
  );
}
