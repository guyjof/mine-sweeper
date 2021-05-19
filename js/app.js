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

function buildBoard() {
    gBoard = buildMat(gLevel.SIZE)
    // console.table(gBoard);
    setMinesNegsCount(gBoard)
    return gBoard;
}

function setMinesNegsCount(board) {
    //Count mines around each cell and set the cell's minesAroundCount.
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.isMine) continue;
            cell.minesAroundCount = countMineNegs(i, j);
        }
    }
}

function countMineNegs(cellI, cellJ) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) negsCount++
        }
    }
    return negsCount;
}

function placeMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randCell = getAvilablePos();
        var cellI = randCell.i;
        var cellJ = randCell.j;
        gBoard[cellI][cellJ].isMine = true
    }
    setMinesNegsCount(gBoard)
}

function getAvilablePos() {
    var pos = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isShown) continue;
            if (cell.isMine) continue;
            pos.push({ i: i, j: j });
        }
    }
    var randCell = pos[getRandomIntInclusive(0, pos.length - 1)]
    return randCell;
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





















