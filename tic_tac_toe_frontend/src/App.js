import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color scheme (as CSS variables, see App.css for full set):
 *  --primary:   #2196F3   (blue)
 *  --secondary: #FFFFFF   (white)
 *  --accent:    #4CAF50   (green)
 */

// PUBLIC_INTERFACE
function App() {
  // State for the game board, status, scores, and theme
  const [theme, setTheme] = useState('light');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check for winner or draw after every move
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setScore((prev) => ({ ...prev, [win]: prev[win] + 1 }));
    } else if (board.every(cell => cell !== null)) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    // Don't allow overwriting or moves after game ends
    if (board[idx] || winner || isDraw) return;
    const nextBoard = [...board];
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  function calculateWinner(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // Rows
      [0,3,6],[1,4,7],[2,5,8], // Columns
      [0,4,8],[2,4,6],         // Diagonals
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "It's a draw!"
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="App">
      <header className="tictactoe-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>

        <div className="scoreboard">
          <div className="score">
            <span className="score-label" style={{ color: 'var(--primary)' }}>X</span>
            <span className="score-value">{score.X}</span>
          </div>
          <div className="score">
            <span className="score-label" style={{ color: 'var(--accent)' }}>O</span>
            <span className="score-value">{score.O}</span>
          </div>
        </div>

        <div className="status-text">{status}</div>
      </header>

      <main className="ttt-board-wrapper">
        <Board board={board} onCellClick={handleCellClick} winner={winner} />
      </main>

      <footer className="ttt-controls">
        <button
          className="restart-btn"
          onClick={handleRestart}
          aria-label="Restart Game"
        >
          Restart
        </button>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component - displays the 3x3 grid and handles click events.
 */
function Board({ board, onCellClick, winner }) {
  return (
    <div className="ttt-board grid">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          highlight={winner && cell === winner}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Cell component - a square of the board.
 */
function Cell({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-cell${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      disabled={!!value}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

export default App;
