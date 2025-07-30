import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();

    const newQuestion = {
      prompt: prompt,
      answers: [answer1, answer2],
      correctIndex: parseInt(correctIndex),
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => {
        onAddQuestion(data);
        setPrompt("");
        setAnswer1("");
        setAnswer2("");
        setCorrectIndex(0);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Question</h2>
      <input
        type="text"
        placeholder="Question prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 1"
        value={answer1}
        onChange={(e) => setAnswer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 2"
        value={answer2}
        onChange={(e) => setAnswer2(e.target.value)}
      />
      <select
        value={correctIndex}
        onChange={(e) => setCorrectIndex(e.target.value)}
      >
        <option value="0">Answer 1</option>
        <option value="1">Answer 2</option>
      </select>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;
