import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
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

  test('renders question list', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('Quiz Questions')).toBeInTheDocument();
    });
  });

  test('can switch between form and list views', async () => {
    await act(async () => {
      render(<App />);
    });
    
    act(() => {
      const newQuestionBtn = screen.getByText('New Question');
      fireEvent.click(newQuestionBtn);
    });
    
    expect(screen.getByTestId('question-form')).toBeInTheDocument();
  });

  test('can delete a question', async () => {
    const mockQuestions = [
      { id: 1, prompt: 'Test question', answers: ['A', 'B'], correctIndex: 0 }
    ];
    
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockQuestions),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({}),
        ok: true,
      });
    
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('delete-1')).toBeInTheDocument();
    });
    
    await act(async () => {
      const deleteBtn = screen.getByTestId('delete-1');
      fireEvent.click(deleteBtn);
    });
    
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/questions/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});