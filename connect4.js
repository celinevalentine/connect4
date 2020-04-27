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
//board array is the model and table is the view, whenver board changes, view needs to update (eg: line 112 and 113)

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
// TODO: set "board" to empty HEIGHT x WIDTH matrix array
function makeBoard() {

    //let x = col (add up to width), y = row (add up to height), outerloop to make rows and innerloop to make col
    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));
    }
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.getElementById("board");
    // TODO: add comment for this code
    //create "tr" element for top row, then set id and add click event listener
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);
    //create "td" element for top row as headcell(x), set Id then append it to top tr, append top tr to htmlBoard
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // TODO: add comment for this code
    //make main board 7x6 table, tr,td then set cell ID row-col, then append cell to row, append row to board
    for (let y = 0; y < HEIGHT; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return lowest row y with empty cell (null if filled) */

function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    //loop rows from (y-1) on bottom to look for empty cell on col x, or return 0, user needs to know lowest free cell in the col!
    for (let y = HEIGHT - 1; y >= 0; y--) {
        //if cell is empty, then return y to see which row that empty cell is
        if (!board[y][x]) {
            return y;
        }
    }
    //if no empty cells in col x, return null-might be other empty cells in other col
    return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell
    const piece = document.createElement("div");
    piece.classList.add("piece")
    piece.classList.add(`p${currPlayer}`);
    // piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
    // TODO: pop up alert message
    // const msg = `"Player ${currPlayer} won!"`
    //line 103 and 108 specifiy about msg, so can't define msg for tie or winner endgame outcomes
    alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    // get x from ID of clicked cell
    //why +evt, not a good way of converting str to num; once clicked, ID will be betw 0-6
    // const x = +evt.target.id;
    const x = Number(evt.target.id);


    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (board.every(row => row.every(cell => cell))) {
        return endGame("Tie!");
    }
    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1 ? 2 : 1;
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

    // TODO: read and understand this code. Add comments to help you.
    //describe 4 possible ways of connecting 4 with any x and y values.
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            //horizontally connects 4
            let horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            //vertically
            let vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            //diagnally going up
            let diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            //diagnolaly going down
            let diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];
            //if it meets 1 of these 4 cases, player wins
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();