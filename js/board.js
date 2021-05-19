function buildMat(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board, selector) {
    //Render the board as a <table> to the page
    var strHTML = `<table border="1"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board.length; j++) {
            var cell = EMPTY;
            if (cell.isMine) {
                cell = EMPTY;
            }

            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this)"> ${cell} </td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;

}
