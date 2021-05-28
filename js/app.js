'use strict'
const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';
const BASIC = '😃'
const WIN = '😎';
const BLOWN = '🤯'
const LOSE = '😭';
const LIFE = '<img src="img/heart.png" />' //heart img

var gLevel = {
    SIZE: 12,
    MINES: 30
};

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    markedMines: 0,
    secsPassed: 0
};
var gBoard = buildBoard();
var gLives = 3;
var isFirstClick = false;
var startTime = 0;
var seconds = 0;
var setIntervalId;
var elTime = document.querySelector('.stopwatch');
var elSmile = document.querySelector('.smile')


function initGame() { //This is called when page loads or clicking on the icon
    elSmile.innerText = BASIC //resets emoji
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    console.log(gBoard);
    isFirstClick = false;
    elTime.innerText = 0;
    gLives = 3;
    livesCount()
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    clearInterval(setIntervalId) // stoping timer
}

function cellClicked(elCell) {
    var cellCoord = getCellCoord(elCell.classList[1]); // cell i & j
    var currCell = gBoard[cellCoord.i][cellCoord.j]; // current cell object
    var isMine = (currCell.isMine) ? MINE : currCell.minesAroundCount;
    var isShown = (currCell.isShown) ? isMine : EMPTY;

    if (!gGame.isOn) return; //if game is over
    if (currCell.isMarked) return; // if cell is marked you can't click to revel it
    if (currCell.isShown) return; // if cell is shown you can't click you caant click it again
    if (!currCell.isShown) currCell.isShown = true;
    elCell.classList.add('cell-pressed') // adding cell clicked style

    if (!isFirstClick) { //checking if it is the games first click
        placeMines()// placeing mines so the first click is never a mine
        startTimer();// starting the timer
        isFirstClick = true // next click is not first click
    }


    if (!currCell.isMine) { //if cuurent cell is not a mine 
        if (currCell.minesAroundCount) { //if current cell has more than 1 mine neg
            renderCell(cellCoord, currCell.minesAroundCount)// show current cell mine negs count
            gGame.shownCount++
        } else { //if current cell dosent have mine negs
            renderCell(cellCoord, isShown) // show empty cell
            expandShown(gBoard, elCell, cellCoord.i, cellCoord.j); // show cell negs minearoundcount
            gGame.shownCount++
        }
    }

    if (currCell.isMine) { //if user pressed a mine
        if (gLives > 0) { // if user's still have lives
            gLives--;
            elSmile.innerText = BLOWN;
            livesCount()
            renderCell(cellCoord, MINE)
            gGame.shownCount++
            currCell.isShown = true;
        }
        if (gLives > 0) { // if user didnt lose dont run this function
            setTimeout(function () {
                elSmile.innerText = BASIC; ///when user steps on mine change emoji for half sec
            }, 500);
        }
    }
    if (!gLives) gGame.isOn = false; // if gLives = 0, game is over
    checkGameOver(gBoard) //checking after each click if game is over
    if (checkGameOver(gBoard)) { //if  game is over and user won
        isVictory() // run victory function
    } else if (!checkGameOver(gBoard) && !gLives) { //if game is over and user lost
        clearInterval(setIntervalId) //stop timer
        elSmile.innerText = LOSE;// chage emoji to lost emoji
    }

}

function cellMarked(elCell) {
    if (!isFirstClick) { //on first right click 
        startTimer() //start timer
        isFirstClick = true // not first click any more
    }
    var currCell = gBoard[elCell.i][elCell.j]; //current cell object

    if (!currCell.isMarked) {//if current cell isnt marked, mark it and update gGame marked count
        currCell.isMarked = true;
        currCell.isShown = true;
        renderCell(elCell, FLAG);
    } else {//if current cell is marked, un mark it and update gGame marked count
        currCell.isMarked = false;
        currCell.isShown = false;
        renderCell(elCell, EMPTY);
    }
    checkGameOver(gBoard)
    if (gGame.markedMines === gLevel.MINES) isVictory()
    if ((gGame.shownCount) === ((gLevel.SIZE ** 2) - gLevel.MINES)) isVictory()
}

function checkGameOver(gBoard) { //checking if the game is over
    //Game ends when all mines are marked, and all the other cells are shown
    gGame.markedMines = 0;
    gGame.markedCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j] //current cell
            if (currCell.isMarked && currCell.isMine) gGame.markedMines += 1; //if current cell is a marked mine update markedMines
            if (currCell.isMarked) gGame.markedCount += 1;// if current cell is marked update gGame marked counter
            if (currCell.shownCount === (gLevel.SIZE ** 2)) { //if all cells are shown or marked
                if (currCell.markedMines !== gLevel.MINES) {// if marked mines number is different from number of mines
                    return false; //user lost
                }
                if (currCell.markedMines === gLevel.MINES) {// if marked mines number is same as number of mines
                    return true;//user won
                }
            }
        }
    }
}

function expandShown(board, elCell, cellI, cellJ) {
    board[cellI][cellJ].isShown = true;
    elCell.isShown = true;
    //When user clicks a cell with no mines around, 
    //we need to open not only that cell, but also its neighbors.
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var elBox = document.querySelector(`.cell-${i}-${j}`) //adding clicked color
            elBox.classList.add('cell-pressed')
            var currCell = board[i][j];
            gGame.shownCount++
            currCell.isShown = true;
            if (currCell.isMine) continue;
            if (currCell.minesAroundCount > 0) {
                renderCell(currCell.location, currCell.minesAroundCount)
            } else if (currCell.minesAroundCount === 0) {
                renderCell(currCell.location, EMPTY)
            }
        }
    }
}

// change game difficulty
function gameLevel(btn) {
    if (btn.innerText === 'Easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        initGame()
        var elTest = document.querySelector('.test')
        elTest.style.width = '191px'
    }
    if (btn.innerText === 'Medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        initGame()
        var elTest = document.querySelector('.test')
        elTest.style.width = '383px'
    }
    if (btn.innerText === 'Hard') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        initGame()
        var elTest = document.querySelector('.test')
        elTest.style.width = '576px'
    }
}

// mouse click
function mouseAction(ev) {
    var elCell = ev.path[0].classList[1];
    if (!elCell) return;
    var cellCoord = getCellCoord(elCell)
    switch (ev.button) {
        case 0: // left click
            if (!gGame.isOn) return ev.button
            checkGameOver(gBoard)
            break;
        case 2: // right click
            cellMarked(cellCoord);
            checkGameOver(gBoard)
            return ev.button
    }
}

function isVictory() {
    clearInterval(setIntervalId)
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







