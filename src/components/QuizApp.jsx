import { useState, useMemo, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../style/QuizApp.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const BATCH_SIZE = 10;

export default function QuizApp({ questionsProp,title,onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [results, setResults] = useState([]);
  const [allSubmitted, setAllSubmitted] = useState(false);

  useEffect(() => {
    if (Array.isArray(questionsProp)) {
      setQuestions(questionsProp);
      setResults(Array.from({ length: questionsProp.length }, () => ({ status: "unanswered", selected: null })));
      setCurrentBatch(0);
      setAllSubmitted(false);
    } else {
      console.error("Quiz questions invalid", questionsProp);
    }
  }, [questionsProp]);

  const totalBatches = useMemo(() => Math.ceil(questions.length / BATCH_SIZE), [questions.length]);
  const score = useMemo(() => results.filter(r => r.status === "correct").length, [results]);
  const completedCount = useMemo(() => results.filter(r => r.status !== "unanswered").length, [results]);

  const startIdx = currentBatch * BATCH_SIZE;
  const endIdx = Math.min(startIdx + BATCH_SIZE, questions.length);
  const batchQuestions = questions.slice(startIdx, endIdx);

  const onSelect = (globalIndex, option) => {
    const r = results[globalIndex];
    if (!r || r.status !== "unanswered" || allSubmitted) return;

    const isCorrect = option === questions[globalIndex].answer;
    const next = [...results];
    next[globalIndex] = { status: isCorrect ? "correct" : "wrong", selected: option };
    setResults(next);
  };

  const goPrevBatch = () => setCurrentBatch(b => Math.max(0, b - 1));
  const goNextBatch = () => setCurrentBatch(b => Math.min(totalBatches - 1, b + 1));
  const resetProgress = () => {
    setResults(Array.from({ length: questions.length }, () => ({ status: "unanswered", selected: null })));
    setCurrentBatch(0);
    setAllSubmitted(false);
  };

  const confirmSubmit = () => setAllSubmitted(true);

  if (questions.length === 0) return <div className="container"><p>Loading…</p></div>;

  if (allSubmitted) {
    const countCorrect = results.filter(r => r.status === "correct").length;
    const countWrong = results.filter(r => r.status === "wrong").length;
    const countNotAttempted = results.filter(r => r.status === "unanswered").length;

    const data = {
      labels: ["Correct", "Wrong", "Not Attempted"],
      datasets: [{
        data: [countCorrect, countWrong, countNotAttempted],
        backgroundColor: ["#22c55e","#f97316","#9ca3af"],
      }]
    };

    return (
      <div className="container stack">
        <h1>Quiz Submitted ✅</h1>
        <div className="row">
          <span className="badge">Correct: {countCorrect}</span>
          <span className="badge">Wrong: {countWrong}</span>
          <span className="badge">Not Attempted: {countNotAttempted}</span>
          <span className="badge">Score: {score}</span>
        </div>
        <div className="card"><Pie data={data} /></div>
        <div className="row">
          <button className="btn-ghost" onClick={resetProgress}>Reset Progress</button>
          <button className="btn-primary" onClick={onClose}>Close Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container stack">
      <h1>MCQ:{title}</h1>

      {/* Top bar */}
      <div className="row">
        <span className="badge">Score: {score}</span>
        <span className="badge">Attempted: {completedCount}/{questions.length}</span>
        <span className="badge">Batch {currentBatch + 1} / {totalBatches}</span>
        <button className="btn-ghost" onClick={resetProgress}>Reset</button>
        <button className="btn-primary" onClick={confirmSubmit}>Submit</button>
        <button className="btn-secondary" onClick={onClose}>Close Quiz</button>
      </div>

      {/* Batch questions */}
      {batchQuestions.map((q, idx) => {
        const globalIndex = startIdx + idx;
        const r = results[globalIndex];
        return (
          <div key={q.number ?? globalIndex} className="card">
            <h3>{globalIndex + 1}. {q.question}</h3>
            <div className="stack">
              {q.options.map((opt, i) => {
                let cls = "opt blue";
                if (r.status === "correct") cls = opt === q.answer ? "opt green" : "opt gray";
                else if (r.status === "wrong") cls = opt === q.answer ? "opt green" : opt === r.selected ? "opt orange" : "opt gray";
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={r.status !== "unanswered"}
                    onClick={() => onSelect(globalIndex, opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Batch navigation */}
      <div className="card">
        <div className="footer">
          <button onClick={goPrevBatch} disabled={currentBatch===0}>← Prev {BATCH_SIZE}</button>
          <span>Questions {startIdx + 1}-{endIdx} of {questions.length}</span>
          <button onClick={goNextBatch} disabled={currentBatch>=totalBatches-1}>Next {BATCH_SIZE} →</button>
        </div>
      </div>
    </div>
  );
}
