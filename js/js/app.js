const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';
const BASIC = '😃'
const WIN = '😎';
const LOSE = '😭';


var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gBoard;
var gGameIsOn = true;

function initGame() { //This is called when page loads
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    placeMines()

}

function cellClicked(elCell) {
    //Called when a cell (td) is clicked
    var cellCoord = getCellCoord(elCell.classList[1]);
    var currCell = gBoard[cellCoord.i][cellCoord.j];
    if (currCell.isMarked) return;
    if (currCell.isMine) {
        renderCell(cellCoord, MINE)
    }
    if (!currCell.isMine) {
        if (currCell.minesAroundCount > 0) {
            renderCell(cellCoord, currCell.minesAroundCount)
        } else {
            renderCell(cellCoord, EMPTY)
        }
    }
}

function cellMarked(elCell) {
    //Called on right click to mark a cell (suspected to be a mine) 
    //Search the web (and implement) how to hide the context menu on right click
}

function checkGameOver() {

    //Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
    //When user clicks a cell with no mines around, 
    //we need to open not only that cell, but also its neighbors.
    // NOTE: start with a basic implementation that only opens
    //the non-mine 1st degree neighbors


    //BONUS: if you have the time later, try to work more 
    //like the real algorithm (see description at the Bonuses section)
}

// change game difficulty

function easy(btn) {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    placeMines()
}

function medium(btn) {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    placeMines()
}

function hard(btn) {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    placeMines()
}

// mouse click
function mouseAction(ev) {
    console.log(ev);
    switch (ev.button) {
        case 0: // right click

            break;
        case 1:
            break;
        case 2: // left click
            // cellMarked(elCell);
            break;
    }
}



















