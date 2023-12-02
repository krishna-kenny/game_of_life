import React, { useState, useEffect } from 'react';

const App = () => {
  const numberOfVerticalCells = 3;
  const numberOfHorizontalCells = Math.floor((numberOfVerticalCells * window.innerWidth) / window.innerHeight);
  const area = numberOfVerticalCells * numberOfHorizontalCells;
  const world = [1000, 2000];
  const [xBoard, setXBoard] = useState(Math.floor(world[0] / 2));
  const [yBoard, setYBoard] = useState(Math.floor(world[1] / 2));
  const [board, setBoard] = useState(() => Array.from({ length: area }).fill(false));
  const [alive, setAlive] = useState([]);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const updateBoard = () => {
      const newBoard = Array.from({ length: area }).fill(false);
      let xAxis, yAxis;
      for (let caIdx = 0; caIdx < alive.length; caIdx++) {
        xAxis = (alive[caIdx] % numberOfHorizontalCells) - xBoard;
        yAxis = Math.floor(alive[caIdx] / numberOfHorizontalCells) - yBoard;
        newBoard[(yAxis * numberOfHorizontalCells) + xAxis] = true;
      }
      setBoard(newBoard);
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp': setYBoard((y) => y - 1); break;
        case 'ArrowDown': setYBoard((y) => y + 1); break;
        case 'ArrowLeft': setXBoard((x) => x - 1); break;
        case 'ArrowRight': setXBoard((x) => x + 1); break;
        default: break;
      }
      updateBoard();
    };

    const handleKeyUp = (event) => {
      if (event.key === ' ' || event.key === 'Enter')
        setPlay((p) => !p);
    };

    const nextGen = () => {
      const nextGenAlive = [];
      for (let caIdx = 0; caIdx < alive.length; caIdx++) {
        const community = [
          caIdx-world[1]-1,
          caIdx-world[1],
          caIdx-world[1]+1,
          caIdx-1,
          caIdx,
          caIdx+1,
          caIdx+world[1]-1,
          caIdx+world[1],
          caIdx+world[1]+1,
        ]

        let brothers; let neighbours;
        for(let commIdx = 0; commIdx < community.length; commIdx++){
          brothers=0;
          neighbours = [
            commIdx-world[1]-1,
            commIdx-world[1],
            commIdx-world[1]+1,
            commIdx-1,
            commIdx+1,
            commIdx+world[1]-1,
            commIdx+world[1],
            commIdx+world[1]+1,
          ];
          for(let a = 0; a < neighbours.length; a++){
            if(alive.includes(neighbours[a]))
              brothers++;
          }
          
          if(alive.includes(commIdx)){
            if(brothers === 2){
              nextGenAlive.push(commIdx);
            }
          }
          if(brothers === 3){
            nextGenAlive.push(commIdx);
          }          
        }
      }
      setAlive(nextGenAlive);
    }


    const gameLoop = setInterval(() => {
      if (play && alive.length) {
        nextGen();
      } else {
        setPlay(false);
      }
    }, 1000);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [alive, play, xBoard, yBoard, numberOfHorizontalCells, area]);

  const handleCellClick = (rowIndex, colIndex) => {
    const cellIndex = rowIndex * numberOfHorizontalCells + colIndex;
    setAlive((prevState) => (
      prevState.includes(cellIndex)
        ? prevState.filter(item => item !== cellIndex)
        : [...prevState, cellIndex]
    ));
  };

  const displayBoard = () => (
    <div style={styles.gameBoard}>
      {board.map((cell, index) => (
        <div
          key={index}
          style={{
            ...styles.cell,
            backgroundColor: alive.includes(index) ? 'white' : 'black',
          }}
          onClick={() => handleCellClick(
            Math.floor(index / numberOfHorizontalCells),
            index % numberOfHorizontalCells
          )}
        />
      ))}
    </div>
  );

  const styles = {
    gameBoard: {
      display: 'grid',
      gridTemplateColumns: `repeat(${numberOfHorizontalCells}, 1fr)`,
      gridTemplateRows: `repeat(${numberOfVerticalCells}, 1fr)`,
      position: 'absolute',
      margin: 0,
      padding: 0,
      width: '98vw',
      height: '90vh',
    },
    cell: {
      height: '100%',
      width: '100%',
      aspectRatio: '1/1', // Ensures the cell is square
      border: '1px solid grey',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.gameBoard}>
      {displayBoard()}
    </div>
  );
};

export default App;
