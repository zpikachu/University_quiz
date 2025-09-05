import "../style/SearchBar.css";

export default function SearchBar({ value, onChange, disabled }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search quizzes by starting letters..."
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="search-bar-input"
      />
    </div>
  );
}
