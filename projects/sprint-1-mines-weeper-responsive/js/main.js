'use strict;'

const MINE = '💣';
const FLAG = '🚩';
const SAD_SMILEY = '😵';
const VICTORY_SMILEY = '😍';
const NORMAL_SMILEY = '😊';

var gBoard, gState, gTimeInterval, gSeconds, gMinutes;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

localStorage.setItem('easySec', Infinity);
localStorage.setItem('hardSec', Infinity);
localStorage.setItem('extremeSec', Infinity);

//This is called when page loads
function initGame() {

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = NORMAL_SMILEY;
    var elNumMines = document.querySelector('.num-mines h5');
    elNumMines.innerText = gLevel.MINES;

    gBoard = buildBoard();
    gState = {
        isGameOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    setMines(gBoard);
    setMinesNegsCount(gBoard);
    clearTimeout(gTimeInterval);
    gTimeInterval = false;
    clearStopper();
    fitPresent();
    renderBoard();

}

// To set new level
function levelInit(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    var elMessage = document.querySelector('.messege');
    elMessage.innerText = '';
    initGame();
}

// seting new game in the same level
function newGame() {
    levelInit(gLevel.SIZE, gLevel.MINES);
}


//BUILD BOARD- THERE IS SEPERAT FUNCTION TO SET MINES
function buildBoard() {
    var size = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i].push({
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false,
            });
        }
    }
    return board;
}

// Print the board as a <table> to the page
function renderBoard() {
    var elBoard = document.querySelector('.table-body');
    var strHTML = '';
    var cell = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i},${j})">${cell}</td>`;
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}

//Function that creat array of indexses-its
// 'help' function to setMines()
function createIndexsArray() {
    var indexses = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            indexses.push({ i: i, j: j });
        }
    }
    return indexses;
}

//set mines -💣- IN THE MODEL
function setMines(board) {
    var indexsesArray = createIndexsArray();
    for (var i = 0; i < gLevel.MINES; i++) {
        var index = getRandomIntInclusive(0, indexsesArray.length - 1);
        var indexMine = indexsesArray[index];
        indexsesArray.splice(index, 1);
        board[indexMine.i][indexMine.j].isMine = true;
    }
}

//Sets mines-count to neighbours
function setMinesNegsCount(board) {
    var numNeighbors;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            numNeighbors = countNeighbors(i, j, board);
            if (numNeighbors > 0) {
                board[i][j].minesAroundCount = +numNeighbors;
            }
        }
    }
}

//count the neighbours and send the info
// to setMinesNegsCount(board)
function countNeighbors(cellI, cellJ, board) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

//Called when a cell (td) is clicked
//UPDATE THE MODAL
function cellClicked(elCell, i, j) {

    if (!gTimeInterval) {
        timer();
        // setMines(gBoard);
        // setMinesNegsCount(gBoard);
    }
    if (gState.isGameOn && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gState.shownCount++;
        renderCell(elCell, i, j);
        checkMineClicked(elCell, i, j);
        expandShown(gBoard, elCell, i, j);
        checkGameOver(elCell, i, j);
    }

}

// update the DOM-SET BOBM/NUM-NEIGHBOURS
function renderCell(elCell, i, j) {
    var cell;
    if (gBoard[i][j].isMine) {
        cell = MINE;
    } else {
        cell = gBoard[i][j].minesAroundCount;
    }
    elCell.innerText = cell;
    elCell.style.background = 'pink';

}

//check if the cell clicked is mine
//if so,  expose all cells that are mines
//and prints game over 
function checkMineClicked(elCell, i, j) {
    var elSmiley = document.querySelector('.smiley');
    var elMessege = document.querySelector('.messege');
    var elMine;

    if (gBoard[i][j].isMine) {
        elSmiley.innerText = SAD_SMILEY;

        for (var i = 0; i < gBoard[0].length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                    gBoard[i][j].isShown = true;
                    gState.shownCount++;
                    elMine = document.querySelector(`.cell-${i}-${j}`);
                    elMine.style.background = 'pink';
                    elMine.innerText = MINE;
                }
            }
        }
        clearTimeout(gTimeInterval);
        gState.isGameOn = false;
        elMessege.innerText = 'Game   over!!!! ' + SAD_SMILEY;
    }
}


// Called on right click to mark a cell as suspected
// to have a mine
function cellMarked(event) {
    document.oncontextmenu = function () {
        return false;
    };

    if (event.button === 2) {
        //FIND THE INDEX OF CELL TO MARKE
        var elCell = event.target;
        var cellClasses = elCell.classList;
        var cellClass = cellClasses[1];
        var arrayClass = cellClass.split('-');
        var cellIndexI = arrayClass[1];
        var cellIndexJ = arrayClass[2];
        //WHEN CELL NOT MARKED
        if (gState.isGameOn && gState.markedCount < gLevel.MINES && !gBoard[cellIndexI][cellIndexJ].isMarked && !gBoard[cellIndexI][cellIndexJ].isShown) {
            if (!gTimeInterval) {
                timer();
            }
            gState.markedCount++;
            gBoard[cellIndexI][cellIndexJ].isMarked = true;
            elCell.innerText = FLAG;
            //WHEN CELL MARKED
        } else if (gBoard[cellIndexI][cellIndexJ].isMarked) {
            {
                gState.markedCount--;
                gBoard[cellIndexI][cellIndexJ].isMarked = false;
                elCell.innerText = '';
            }
        }
    }
    checkGameOver(elCell, cellIndexI, cellIndexJ);
}

//Game ends when all mines are marked and all the other 
//cells are shown OR user click one mine
function checkGameOver(elCell, cellI, cellJ) {
    var elMessege = document.querySelector('.messege');
    var elSmiley = document.querySelector('.smiley');
    if (gState.shownCount + gState.markedCount === gLevel.SIZE * gLevel.SIZE) {
        //If last cell clicked is mine and not marked
        //game ends (In other function it is being exposed and sends a message of game over)
        if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked) {
            return;
        } else {
            // If last cell not MINE-victory
            gState.isGameOn = false;
            clearInterval(gTimeInterval);
            elMessege.innerText = 'VICTORY!!!! ' + VICTORY_SMILEY;
            elSmiley.innerText = VICTORY_SMILEY;
            setBestTimeOnDOM()
        }

    }
}

// Show the best score on the DOM in the end of the game
function setBestTimeOnDOM() {
    var time;
    if (gLevel.SIZE === 4) {
        time = +localStorage.getItem('easySec');
        if (gState.secsPassed < time) {
            localStorage.setItem('easySec', gState.secsPassed);
            document.querySelector('.easy span').innerText = gState.secsPassed;
        }
    }
    if (gLevel.SIZE === 6) {
        time = +localStorage.getItem('hardSec');
        if (gState.secsPassed < time) {
            localStorage.setItem('hardSec', gState.secsPassed);
            document.querySelector('.hard span').innerText = gState.secsPassed;
        }
    }
    if (gLevel.SIZE === 8) {
        time = +localStorage.getItem('extremeSec');
        if (gState.secsPassed < time) {
            localStorage.setItem('extremeSec', gState.secsPassed);
            document.querySelector('.extreme span').innerText = gState.secsPassed;
        }
    }
}

//If empty cell clicked then expand to 2 levels of Showing cells: 
function expandShown(board, elCell, cellI, cellJ) {
    var elCellToShow = 'none';
    if (board[cellI][cellJ].isShown && elCell.innerText === '') {
        for (var i = cellI - 2; i <= cellI + 2; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 2; j <= cellJ + 2; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board.length) continue;

                if (!board[i][j].isShown && !board[i][j].isMarked && !board[i][j].isMine) {
                    board[i][j].isShown = true;
                    gState.shownCount++;
                    elCellToShow = document.querySelector(`.cell-${i}-${j}`);
                    renderCell(elCellToShow, i, j);
                }

            }
        }
    }
}

//Set seconds and minutes in the stopper
function add() {
    gSeconds++;
    gState.secsPassed++;
    if (gSeconds >= 60) {
        gSeconds = 0;
        gMinutes++;
    }
    var eltime = document.querySelector('.time');
    eltime.textContent = (gMinutes ? (gMinutes > 9 ? gMinutes : "0" + gMinutes) : "00")
        + ":" + (gSeconds > 9 ? gSeconds : "0" + gSeconds);

    timer();
}

//Stopper -calls the interval
function timer() {
    gTimeInterval = setTimeout(add, 1000);
}

// Clear the stopper on the Dom
function clearStopper() {
    var eltime = document.querySelector('.time');
    eltime.textContent = "00:00";
    gSeconds = 0; gMinutes = 0;
}

//  Get random num
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Adjust the margins between different parts in the DOM
function fitPresent() {
    var elTable = document.querySelector('.table-container');
    var elMessege = document.querySelector('.messege');
    if (gBoard[0].length === 8) {
        elTable.style.marginTop = '180px';
        elMessege.style.marginTop = '-115px';

    } else if (gBoard[0].length === 6) {
        elTable.style.marginTop = '150px';
        elMessege.style.marginTop = '-70px';

    } else {
        elTable.style.marginTop = '100px';
        elMessege.style.marginTop = '-50px';
    }
}