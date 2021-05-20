'use strict'
const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';
const BASIC = '😃'
const WIN = '😎';
const LOSE = '😭';
const LIFE = '<img src="img/heart.png" />'

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
var gBoard = buildBoard();
var gGameIsOn = true;
var gLives = 3;
var gClickCount = 0;
var startTime = 0;
var seconds = 0;
var setIntervalId;

var elTime = document.querySelector('.stopwatch');
var elSmile = document.querySelector('.smile')
elSmile.innerText = BASIC


function initGame() { //This is called when page loads
    gBoard = buildBoard();
    placeMines()
    renderBoard(gBoard, '.game-board');
    console.log(gBoard);
    gClickCount = 0;
    clearInterval(setIntervalId)
    elTime.innerText = 0;
    gLives = 3;
    livesCount()

}

function cellClicked(elCell, ev) {
    if (!gGameIsOn) return;
    var cellCoord = getCellCoord(elCell.classList[1]);
    var currCell = gBoard[cellCoord.i][cellCoord.j];
    console.log(currCell);
    elCell.classList.add('cell-pressed')
    if (currCell.isMarked) return;
    if (!currCell.isShown) currCell.isShown = true;

    if (currCell.isMine) {
        if (gLives > 0) {
            gLives--;
            livesCount()
            renderCell(cellCoord, MINE)
        }
    }
    if (currCell.isMine && !gLives) {
        var mines = [];
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                currCell = gBoard[i][j];
                if (currCell.isMine)
                    mines.push({ i: i, j: j })
            }
        }
        for (var i = 0; i < mines.length - 1; i++) {
            renderCell(mines[i], MINE)
        }
    }

    if (!gLives) gGameIsOn = false;
    if (!currCell.isMine) {
        if (currCell.minesAroundCount === 0) {
            expandShown(gBoard, elCell, cellCoord.i, cellCoord.j);
            renderCell(cellCoord, EMPTY)
            elCell.classList.add('cell-pressed')

        } else if (currCell.minesAroundCount > 0) {
            expandShown(gBoard, elCell, cellCoord.i, cellCoord.j);
            renderCell(cellCoord, currCell.minesAroundCount)
            elCell.classList.add('cell-pressed')
        }
    }

    if (gClickCount === 0) {
        placeMines()
        gClickCount++;
        startTimer();
    }
    if (MouseEvent.button === 0) cellClicked(elCell);
    if (MouseEvent.button === 2) cellMarked(elCell);

    if (checkGameOver(gBoard)) {
        isVictory()
    } else {
        elSmile.innerText = LOSE;
    }

}

function cellMarked(elCell) {
    if (!gGameIsOn) return;
    if (gClickCount === 0) {
        startTimer()
        gClickCount++;
    }
    var currCell = gBoard[elCell.i][elCell.j];
    if (currCell.isShown) return
    if (!currCell.isMarked) {
        currCell.isMarked = true;
        renderCell(elCell, FLAG);
        gGame.markedCount++
    } else {
        currCell.isMarked = false;
        renderCell(elCell, EMPTY);
        gGame.markedCount--
    }
}

function checkGameOver(gBoard) {
    var counter = 0;
    if (!gGameIsOn) return false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked) counter++
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                return
            }
            if (gLevel.MINES < counter) {
                return
            }
        }
        if (counter === gLevel.MINES) return true
    }
    // gGameIsOn = false;
    // clearInterval(setIntervalId)
    //Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, cellI, cellJ) {
    board[cellI][cellJ].isShown = true;
    //When user clicks a cell with no mines around, 
    //we need to open not only that cell, but also its neighbors.
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = board[i][j];
            if (currCell.isMine) return;
            var elBox = document.querySelector(`.cell-${i}-${j}`)
            elBox.classList.add('cell-pressed')
            currCell.isShown = true;
            if (currCell.minesAroundCount > 0) {
                elCell.classList.add('cell-pressed')
                renderCell(currCell.location, currCell.minesAroundCount)
            } else if (currCell.minesAroundCount === 0) {
                elCell.classList.add('cell-pressed')
                renderCell(currCell.location, EMPTY)
            }

        }

    }

    // NOTE: start with a basic implementation that only opens
    //the non-mine 1st degree neighbors
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
    initGame()
}

function hard(btn) {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    placeMines()
    initGame()
}

// mouse click
function mouseAction(ev) {
    var elCell = ev.path[0].classList[1];
    if (!elCell) return;
    var cellCoord = getCellCoord(elCell)
    switch (ev.button) {
        case 0: // left click
            if (!gGameIsOn) return
            break;

        case 2: // right click
            cellMarked(cellCoord);
    }
}

function isVictory() {
    elSmile.innerText = WIN;
}


function startTimer() {
    setIntervalId = setInterval(function () {
        seconds++;
        elTime.innerText = `${seconds}`;
    }, 1000);
}


function livesCount() {
    var strHTML = '';
    for (var i = 0; i < gLives; i++) {
        strHTML += LIFE;
    }
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = strHTML;
}







