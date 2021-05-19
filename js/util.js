
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getCellCoord(strCellCoord) {
    var parts = strCellCoord.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

// function getAvilablePos() {
//     var pos = [];
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[0].length; j++) {
//             var cell = gBoard[i][j];
//             if (cell.isShown) continue;
//             if (cell.isMine) continue;
//             pos.push({ i: i, j: j });
//         }
//     }
//     return pos;
// }

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}