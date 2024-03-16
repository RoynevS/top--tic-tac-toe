function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
}


function gameboard() {
  const board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const getBoard = () => board;

  const setMarks = (row, column, player) => {
    if (board[row][column] === "X" || board[row][column] === "O") return;

    board[row][column] = player.getMarker();
  };

  const printBoard = () => {
    console.log(board);
  };
  
  return { getBoard, setMarks, printBoard };
}
