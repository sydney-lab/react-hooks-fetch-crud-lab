import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../components/App";

// Mock fetch
beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation((url, options) => {
    if (!options) {
      // GET
      return Promise.resolve({
        json: () => Promise.resolve([
          {
            id: 1,
            prompt: "lorem testum 1",
            answers: ["A", "B", "C", "D"],
            correctIndex: 0,
          },
          {
            id: 2,
            prompt: "lorem testum 2",
            answers: ["A", "B", "C", "D"],
            correctIndex: 2,
          },
        ]),
      });
    }
    if (options.method === "POST") {
      // POST
      return Promise.resolve({
        json: () => Promise.resolve({
          id: 3,
          prompt: JSON.parse(options.body).prompt,
          answers: JSON.parse(options.body).answers,
          correctIndex: JSON.parse(options.body).correctIndex,
        }),
      });
    }
    if (options.method === "DELETE") {
      // DELETE
      return Promise.resolve({});
    }
    if (options.method === "PATCH") {
      // PATCH
      return Promise.resolve({
        json: () => Promise.resolve({
          id: 1,
          prompt: "lorem testum 1",
          answers: ["A", "B", "C", "D"],
          correctIndex: JSON.parse(options.body).correctIndex,
        }),
      });
    }
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/New Question/i));

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "New test prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "X" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Y" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "Z" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "W" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "2" },
  });

  fireEvent.submit(screen.getByTestId("new-question-form"));

  await waitFor(() =>
    expect(screen.getByText(/New test prompt/i)).toBeInTheDocument()
  );
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const deleteButton = await screen.findAllByText("Delete Question");
  fireEvent.click(deleteButton[0]);

  await waitFor(() => {
    expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
  });
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const dropdowns = await screen.findAllByLabelText(/Correct Answer/i);
  fireEvent.change(dropdowns[0], { target: { value: "3" } });

  await waitFor(() => {
    expect(dropdowns[0].value).toBe("3");
  });
});