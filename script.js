function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
}


const gameboard = (function() {
  const board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const getBoard = () => board;

  const checkCellEmpty = (row,column) => {
    if (board[row][column] === "X" || board[row][column] === "O") return false;
    return true;
  }

  const setMarks = (row, column, player) => {
    if (!checkCellEmpty(row, column)) return;

    board[row][column] = player.getMarker();
  };

  const printBoard = () => {
    console.table(board);
  };
  
  return { getBoard, setMarks, printBoard, checkCellEmpty };
})();

const gameController = (function() {
  const players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];

  const board = gameboard;

  let activePlayer = players[0];


  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };


  const getActivePlayer = () => activePlayer;


  const printNewRound = () => {
    board.printBoard()

    if (!gameEnd()) {
      console.log(`${getActivePlayer().getName()}'s turn`)
    } else if (gameEnd() && checkDraw()) {
      console.log("Draw");
    } else {
      console.log(`Congratulations ${getActivePlayer().getName()}, you win!`);
    }
  }


  const playRound = (row, column) => {
    // const [row, column] = [null, null]
    // // prompt(`${getActivePlayer().getName()} enter row and column to place your marker:`)
    // //   .split(" ");
    if (!board.checkCellEmpty(row, column)) return;

    console.log(
      `Placing ${getActivePlayer().getName()} marker into row ${row} and column ${column}...`
    );
    board.setMarks(row, column, getActivePlayer());

    
    if (!gameEnd()) {
      switchPlayerTurn();
    }

    printNewRound();

  };


  const checkRow = () => {
    const [row1X, row2X, row3X] = board.getBoard().map(row => row.every(element => element === "X"));
    const [row1O, row2O,row3O] = board.getBoard().map(row => row.every(element => element === "O"))
    return row1O || row1X || row2O || row2X || row3O || row3X;
  };


  const checkColumn = () => {
    for (let i = 0; i < 3; i++) {
      const newArr = [];
      for (let j = 0; j < 3; j++) {
        newArr.push(board.getBoard()[j][i]);
      }
      const xCheck = newArr.every(element => element === "X");
      const oCheck = newArr.every(element => element === "O");

      if (xCheck || oCheck) {
        return true;
      }
    }
    return false;
  };

  
  const checkDiagonal = () => {
    const diaToRightCells = [];
    diaToRightCells.push(board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2])
    if (diaToRightCells.every(element => element === "X") || diaToRightCells.every(element => element === "O")) {
      return true;
    } 
    const diaToLeftCells = [];
    diaToLeftCells.push(board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0])
    if (diaToLeftCells.every(element => element === "X") || diaToLeftCells.every(element => element === "O")) {
      return true;
    }
    return false;
  };


  const checkDraw = () => {
    let counter = 3;
    board.getBoard().forEach(row => {
      const emptyCells = row.filter(element => element === " ");
      if (emptyCells.length === 0) counter--;
    });

    if (!counter) return true;
    return false;
  };


  const gameEnd = () => checkRow() || checkColumn() || checkDiagonal() || checkDraw();

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
})();


function screenController() {
  const game = gameController;
  const playerActiveDiv = document.querySelector(".active-player");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    console.log(activePlayer.getName())

    playerActiveDiv.textContent = `${activePlayer.getName()}'s turn...`;

    let counter = 0;
    board.forEach(row => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.dataset.row = counter;
        cellButton.textContent = cell;
        boardDiv.appendChild(cellButton);
      })
      counter++
    })
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

screenController();