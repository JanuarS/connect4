/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let row = 0; row < HEIGHT; row++) {
    board.push(new Array(WIDTH).fill(null));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");   // grabs #board from the DOM

  var top = document.createElement("tr");           // creates new top row
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);       // listens for clicks on top row

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");    // creates the columns
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");       // creates rows
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");    // creates columns
      cell.setAttribute("id", `${y}-${x}`);         // sets an column-row id for each cell
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(col) {
  for (let row = HEIGHT - 1; row >= 0; row--) {
    if(board[row][col] === null) {
      return row;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  board[y][x] = currPlayer;
  let chip = document.createElement('div');
  chip.classList.add("piece", `p${currPlayer}`);

  let spot = document.getElementById(`${y}-${x}`);  // grabs the td tag by ID
  spot.append(chip);  // append div to td
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  let playerStatus = document.querySelector("#player-status");    // tracks player move
  // check for win
  if (checkForWin()) {
    playerStatus.innerHTML = `Player ${currPlayer} won!`
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  const isTie = board.every(row => {
    return row.every(item => item === 1 || item === 2)
  });
  if(isTie) {
    playerStatus.innerHTML = `It's a TIE!`
    return endGame(`It's a TIE!`);
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
  
  // Dispaly player status
  playerStatus.innerHTML = `Player ${currPlayer}'s turn`;
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Checks for different win scenarios - horizontal, vertical, diagonal right, diagonol left
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** reset: resets the game */

const resetBtn = document.querySelector("button");
resetBtn.addEventListener("click", () => {
  window.location.reload();
});

makeBoard();
makeHtmlBoard();
