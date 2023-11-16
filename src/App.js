import React, { useState, useEffect } from 'react';

const App = () => {
  const [board, setBoard] = useState(() => {
    return Array.from({ length: 25 }, () => Array(parseInt(25 * window.innerWidth / window.innerHeight)).fill(false));
  });
  const [alive, setAlive] = useState([[0, 0]]);
  const width = parseInt(25 * window.innerWidth / window.innerHeight);


  useEffect(() => {
    const updateBoard = () => {
      const newBoard = Array.from({ length: 25 }, () => Array(parseInt(25 * window.innerWidth / window.innerHeight)).fill(false));
      for (let a = 0; a < alive.length; a++) {
        try{
          newBoard[alive[a][0]][alive[a][1]] = true;
        }catch(e){
          continue;
        }
      }
      setBoard(newBoard);
    }

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setAlive(alive.map((coord) => [coord[0] + 1, coord[1]]));
          break;
        case 'ArrowDown':
          setAlive(alive.map((coord) => [coord[0] - 1, coord[1]]));
          break;
        case 'ArrowLeft':
          setAlive(alive.map((coord) => [coord[0], coord[1] + 1]));
          break;
        case 'ArrowRight':
          setAlive(alive.map((coord) => [coord[0], coord[1] - 1]));
          break;
        default:
          break;
      }
      updateBoard();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [alive, setBoard]);


  const handleCellClick = (row, col) => {
    // Example: Set alive on the clicked Cell
    const newBoard = [...board];
    newBoard[row][col] = !board[row][col];; // Replace 'alive' with a proper representation
    setBoard(newBoard);
    setAlive([...alive, [row, col]]);
  };

  const styles = {
    app: {
      display: 'flex',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'black',
    },
    gameBoard: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    boardRow: {
      display: 'flex',
    },
    Cell: {
      width: '4vh',
      height: '4vh',
      border: '1px solid grey',
      backgroundColor: 'black',
      boxSizing: 'border-box',
      cursor: 'pointer',
    },
    alive: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white', // Adjust color as needed
    },
  };

  return (
    <div style={styles.app}>
      <div style={styles.gameBoard}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.boardRow}>
            {row.slice(0,width).map((alive, colIndex) => (
              <div key={colIndex} style={styles.Cell} onClick={() => handleCellClick(rowIndex, colIndex)}>
                {/* Render alives or empty Cells */}
                {alive && <div style={styles.alive} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App; 