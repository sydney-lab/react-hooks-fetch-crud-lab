import React, { useState } from "react";

function NewQuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("answer")) {
      const index = parseInt(name.replace("answer", ""));
      const newAnswers = [...formData.answers];
      newAnswers[index] = value;
      setFormData({ ...formData, answers: newAnswers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: parseInt(formData.correctIndex),
      }),
    })
      .then((res) => res.json())
      .then(onAddQuestion);

    setFormData({
      prompt: "",
      answers: ["", "", "", ""],
      correctIndex: 0,
    });
  }

  return (
    <section>
      <h2>New Question</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type="text"
              name={`answer${index}`}
              value={answer}
              onChange={handleChange}
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((_, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default NewQuestionForm;
