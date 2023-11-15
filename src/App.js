import React, { useState, useEffect } from 'react';

const distanceScaling = 100;

const App = () => {
  const [board, setBoard] = useState(() => {
    // Initialize the board with empty intersections
    return Array.from({ length: distanceScaling }, () => Array(distanceScaling).fill(null));
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          window.scrollBy(0, -10); // Scroll up
          break;
        case 'ArrowDown':
          window.scrollBy(0, 10); // Scroll down
          break;
        case 'ArrowLeft':
          window.scrollBy(-10, 0); // Scroll left
          break;
        case 'ArrowRight':
          window.scrollBy(10, 0); // Scroll right
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleIntersectionClick = (row, col) => {
    // Example: Set a stone on the clicked intersection
    const newBoard = [...board];
    newBoard[row][col] = 'stone'; // Replace 'stone' with a proper representation
    setBoard(newBoard);
  };

  const styles = {
    gameBoard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    boardRow: {
      display: 'flex',
    },
    intersection: {
      width: '30px',
      height: '30px',
      border: '1px solid #000',
      cursor: 'pointer',
    },
    stone: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: 'black', // Adjust color as needed
    },
  };

  return (
    <div style={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={styles.boardRow}>
          {row.map((stone, colIndex) => (
            <div key={colIndex} style={styles.intersection} onClick={() => handleIntersectionClick(rowIndex, colIndex)}>
              {/* Render stones or empty intersections */}
              {stone && <div style={styles.stone} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
