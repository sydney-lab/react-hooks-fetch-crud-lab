
import React, { useState, useEffect } from "react";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);

  // ✅ Fetch questions on load
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  // ✅ Add new question
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  // ✅ Delete question
  function handleDeleteQuestion(id) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  // ✅ Update question
  function handleUpdateQuestion(updatedQuestion) {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }

  return (
    <div className="App">
      <h1>Quiz Admin</h1>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList
        questions={questions}
        onDeleteQuestion={handleDeleteQuestion}
        onUpdateQuestion={handleUpdateQuestion}
      />
    </div>
  );
}

export default App;
