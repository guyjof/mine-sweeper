function buildMat(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (j = 0; j < size; j++) {
            board[i][j] = '';
        }
    }
    return board;
}

function renderBoard(board, selector) {
    //Render the board as a <table> to the page
    var strHTML = `<table><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            var className = `cell cell-${i}-${j}`;
            var isMine = (cell.isMine) ? MINE : cell.minesAroundCount;
            var isShown = (cell.isShown) ? isMine : EMPTY;
            strHTML += `<td class="${className}" onclick="cellClicked(this,event)"> ${isShown} </td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;

}

function buildBoard() {
    gBoard = buildMat(gLevel.SIZE)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            };
            gBoard[i][j] = cell;
        }
    }
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.game-board');
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
            if (gBoard[i][j].isMarked) continue;
            if (gBoard[i][j].isShown) continue;
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
