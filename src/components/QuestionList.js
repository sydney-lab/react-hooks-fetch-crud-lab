import React from "react";

function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion }) {
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => onDeleteQuestion(id));
  }

  function handleChangeCorrectAnswer(id, newIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: parseInt(newIndex) }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => onUpdateQuestion(updatedQuestion));
  }

  return (
    <div>
      <h2>All Questions</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            <strong>{q.prompt}</strong>
            <br />
            Correct Answer:{" "}
            <select
              value={q.correctIndex}
              onChange={(e) => handleChangeCorrectAnswer(q.id, e.target.value)}
            >
              {q.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
            <button onClick={() => handleDelete(q.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
