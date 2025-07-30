// At the top of your test file
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
      ok: true,
    })
  );
});

afterEach(() => {
  fetch.mockClear();
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
  });

  test('renders question list', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Quiz Questions')).toBeInTheDocument();
    });
  });

  test('can switch between form and list views', async () => {
    render(<App />);
    const newQuestionBtn = screen.getByText('New Question');
    fireEvent.click(newQuestionBtn);
    expect(screen.getByTestId('question-form')).toBeInTheDocument();
  });

  test('can delete a question', async () => {
    const mockQuestions = [
      { id: 1, prompt: 'Test question', answers: ['A', 'B'], correctIndex: 0 }
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockQuestions),
      })
    );
    
    render(<App />);
    await waitFor(() => {
      const deleteBtn = screen.getByTestId('delete-1');
      fireEvent.click(deleteBtn);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/questions/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});