import React, { useState, useEffect } from 'react';

const App = () => {
  const [board, setBoard] = useState(() => {
    return Array.from({ length: 25 }, () => Array(parseInt(25 * window.innerWidth / window.innerHeight)).fill(false));
  });
  const [alive, setAlive] = useState([]);
  const [play, setPlay] = useState(false);
  const width = parseInt(25 * window.innerWidth / window.innerHeight);


  const has = (lst, el)=>{
    for(let i=0; i<lst.length; i++){
      if(lst[i][0]===el[0]&&lst[i][1]===el[1])
        return true;
    }
    return false;
  }


  useEffect(() => {
    const updateBoard = () => {
      const newBoard = Array.from({ length: 25 }, () => Array(parseInt(25 * window.innerWidth / window.innerHeight)).fill(false));
      for(let i=0; i<alive.length; i++) {        
        try {
          newBoard[alive[i][0]][alive[i][1]] = true;
        } catch (e) { }
      }
      setBoard(newBoard);
    }

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setAlive((currAlive) => (currAlive ? [...currAlive].map(coord => [coord[0] + 1, coord[1]]) : []));
          break;
        case 'ArrowDown':
          setAlive((currAlive) => (currAlive ? [...currAlive].map(coord => [coord[0] - 1, coord[1]]) : []));
          break;
        case 'ArrowLeft':
          setAlive((currAlive) => (currAlive ? [...currAlive].map(coord => [coord[0], coord[1] + 1]) : []));
          break;
        case 'ArrowRight':
          setAlive((currAlive) => (currAlive ? [...currAlive].map(coord => [coord[0], coord[1] - 1]) : []));
          break;
        default:
          break;
      }
      updateBoard();
    };


    const nextGen = () => {      
      const neighbors = [];
      for(let i = 0; i < alive.length; i++) {
        let v0 = alive[i][0];
        let v1 = alive[i][1];
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if(!has(neighbors, [v0+i,v1+j]))
              neighbors.push([v0+i,v1+j]);
          }
        }
      }
      
      const nextGenAlive = [];
      for(let i = 0; i < neighbors.length; i++) {
        let v0 = neighbors[i][0];
        let v1 = neighbors[i][1];
        let liveNeighbors = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i||j===false) 
              continue;
            liveNeighbors += has(alive, [v0,v1]) ? 1 : 0;
          }
        }

        if (has(alive,[v0, v1])) {
          if (liveNeighbors === 2)
            nextGenAlive.push([v0, v1]);
        }
        if (liveNeighbors === 3)
          nextGenAlive.push([v0, v1]);
      }    
      setAlive(nextGenAlive);
      console.log(alive);
      updateBoard();
    }


    const handleKeyUp = (event) => {
      if (event.key === ' ' || event.key === 'Enter')
        setPlay((p) => !p);
    }


    const gameLoop = setInterval(() => {
      if (play && alive) {
        nextGen();
      } else {
        setPlay(false);
      }
    }, 1000);


    window.addEventListener('keydown', handleKeyDown);
    handleKeyDown('ArrowUp');
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [alive, play]);


  const handleCellClick = (y, x) => {
    setAlive((has(alive, [y, x]))
      ? alive.filter(cell => !(cell[0] === y && cell[1] === x))
      : [...alive, [y, x]]
    );
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
            {row.slice(0, width).map((alive, colIndex) => (
              <div key={colIndex} style={styles.Cell} onClick={() => handleCellClick(rowIndex, colIndex)}>
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