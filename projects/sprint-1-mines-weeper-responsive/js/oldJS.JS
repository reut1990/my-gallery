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
    gBoard = buildBoard();
    // setMines();
    // setMinesNegsCount(gBoard);
    clearTimeout(gTimeInterval);
    clearStopper();
    gTimeInterval = false;
    fitPresent();
    renderBoard();
    console.table(gBoard);
    gState = {
        isGameOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
}
// To set new level
function levelInit(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    var elMessage = document.querySelector('.messege');
    elMessage.innerText = '';
    // elMessage.style.display = 'none';
    initGame();
}
// seting new game in the same level
function newGame() {
    levelInit(gLevel.SIZE, gLevel.MINES);
}
//Builds the board by setting mines at random locations, 
// and then calling the setMinesNegsCount() 
// Then return the created board
function buildBoard() {
    var size = gLevel.SIZE;
    // console.log(size);
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
            // onmousedown="hendleKey(${event},this,${i},${j})"  
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}

function createIndexsArray() {
    var indexses = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            indexses.push({ i: i, j: j });
        }
    }
    return indexses;
}

//set mines -💣-:)
function setMines() {
    var indexsesArray = createIndexsArray();
    // console.log(indexsesForRandom);
    for (var i = 0; i < gLevel.MINES; i++) {
        var index = getRandomIntInclusive(0, indexsesArray.length - 1);
        var indexMine = indexsesArray[index];
        indexsesArray.splice(index, 1);
        // console.log(indexsesArray);
        console.log('indexMine', i, 'is', indexMine);
        // console.log('place of mines-randomI', 'randomJ', randomI, randomJ);
        gBoard[indexMine.i][indexMine.j].isMine = true;
    }
}

//Sets mines-count to neighbours
function setMinesNegsCount(board) {
    var numNeighbors;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            numNeighbors = countNeighbors(i, j, board);
            // console.log(i, j, 'has neighbours:', numNeighbors)
            if (numNeighbors > 0) {
                board[i][j].minesAroundCount = +numNeighbors;
            }
        }
    }
}

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
function cellClicked(elCell, i, j) {

    console.log('cellClicked', elCell, i, j);//--ok
    if (!gTimeInterval) {
        timer();
        setMines();
        setMinesNegsCount(gBoard);
    }
    // console.log('gBoard[i][j].isMarked', gBoard[i][j].isMarked );
    if (gState.isGameOn && !gBoard[i][j].isMarked
        && !gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gState.shownCount++;
        renderCell(elCell, i, j);
        // elCell.style.opacity = 1;
        mineClicked(elCell, i, j);
        expandShown(gBoard, elCell, i, j);
        checkGameOver(elCell, i, j);
    }

}

// expose all cells that are mines
// if it is not the lsat cell exposed it prints
function mineClicked(elCell, i, j) {
    var elSmiley = document.querySelector('.smiley');
    var elMessege = document.querySelector('.messege');

    var elMine;
    if (gBoard[i][j].isMine) {
        // console.log('yes mine!!!');
        elSmiley.innerText = SAD_SMILEY;
        for (var i = 0; i < gBoard[0].length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                    gBoard[i][j].isShown = true;
                    gState.shownCount++;
                    elMine = document.querySelector(`.cell-${i}-${j}`);
                    // console.log(elMine);
                    elMine.style.background = 'pink';// -to fix the elemnt null : (
                    elMine.innerText = MINE;
                }
            }
        }
        clearTimeout(gTimeInterval);
        elMessege.innerText = 'Game   over!!!! ' + SAD_SMILEY;
        // clearStopper();
        // gTimeInterval = false;
        // var elMessege = document.querySelector('.messege');
        // // elMessege.style.display = 'block';
        // elMessege.innerText = 'Game   over!!!! ' + SAD_SMILEY;
    }
}


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

// Called on right click to mark a cell as suspected to have a mine
function cellMarked(event) {
    document.oncontextmenu = function () {
        return false;
    };
    if (event.button === 2) {
        var elCell = event.target;
        // console.log(elCell);
        var cellsClasses = elCell.classList;
        // console.log(cellsClasses);
        var cellClass = cellsClasses[1];
        // console.log(cellClass);
        var arrayClass = cellClass.split('-');
        // console.log(arrayClass);
        // var cellIndexI = cellClass.charAt(5);
        // var cellIndexJ = cellClass.charAt(7);
        var cellIndexI = arrayClass[1];
        var cellIndexJ = arrayClass[2];
        // console.log(cellIndexI, cellIndexJ);

        if (gState.markedCount < gLevel.MINES &&
            gState.isGameOn &&
            !gBoard[cellIndexI][cellIndexJ].isMarked &&
            !gBoard[cellIndexI][cellIndexJ].isShown) {
            // console.log('gTimeInterval', gTimeInterval);
            if (!gTimeInterval) {
                timer();
            }
            gState.markedCount++;
            gBoard[cellIndexI][cellIndexJ].isMarked = true;
            elCell.innerText = FLAG;
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

//Game ends when all mines are marked and all the other cells are shown
function checkGameOver(elCell, cellI, cellJ) {
    //expose mines well
    // console.log('check gameOver with', elCell, cellI, cellJ);
    // console.log('gState.shownCount', gState.shownCount, 'gState.markedCount', gState.markedCount);
    // console.log('gLevel.SIZE*gLevel.SIZE', gLevel.SIZE * gLevel.SIZE);
    var elMessege = document.querySelector('.messege');
    var elSmiley = document.querySelector('.smiley');

    if (gState.shownCount + gState.markedCount === gLevel.SIZE * gLevel.SIZE) {
        //if last cell clicked is mine and not marked
        //all bombs are exposed and he lose
        if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked) {
            // var elMessege = document.querySelector('.messege');
            // elMessege.innerText = 'Game   over!!!! ' + SAD_SMILEY;
            // elSmiley.innerText = SAD_SMILEY;
            gState.isGameOn = false;
            clearInterval(gTimeInterval);
        } else {
            // if last cell not bomb
            gState.isGameOn = false;
            clearInterval(gTimeInterval);
            elMessege.innerText = 'VICTORY!!!! ' + VICTORY_SMILEY;
            elSmiley.innerText = VICTORY_SMILEY;
            // elSmiley.style.display='block';
            var time;
            if (gLevel.SIZE === 4) {
                time = localStorage.getItem('easySec');
                console.log('time', time, gState.secsPassed)
                if (gState.secsPassed < time) {
                    localStorage.setItem('easySec', gState.secsPassed);
                    document.querySelector('.easy span').innerText = gState.secsPassed;
                }
            }
            if (gLevel.SIZE === 6) {
                time = localStorage.getItem('hardSec')
                if (gState.secsPassed < time) {
                    localStorage.setItem('hardSec', gState.secsPassed);
                    document.querySelector('.hard span').innerText = gState.secsPassed;
                }
            }
            if (gLevel.SIZE === 8) {
                time = localStorage.getItem('extremeSec');
                if (gState.secsPassed < time) {
                    localStorage.setItem('extremeSec', gState.secsPassed);
                    document.querySelector('.extreme span').innerText = gState.secsPassed;
                }
            }
        }

    }
}



// When user clicks an empty place (0 negs),
//  we need to open not only that cell
// , but also its neighbors.
// TIP: At this point you might find yourself giving each cell 
// an id (or a class) that looks like that: "cell-3-2" (3 and 
// 2 are just examples)
// NOTE: start with a basic implementation
//  that only opens the two-level neighbors
// BONUS: if you have 
//  the time later, try to work more like the real algorithm.

function expandShown(board, elCell, cellI, cellJ) {
    // console.log('expend show func works!');
    // console.log(board, elCell, cellI, cellJ);
    console.log('board[cellI][cellJ].isShown', cellI, cellJ, board[cellI][cellJ].isShown);
    // console.log('elCell.innerText', elCell.innerText);
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
                    // debugger;
                    console.log('cell to show', i, j);
                    elCellToShow = document.querySelector(`.cell-${i}-${j}`);
                    // console.log('elCellToShow', elCellToShow);
                    renderCell(elCellToShow, i, j);
                }

            }
        }
    }
}


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
function timer() {
    gTimeInterval = setTimeout(add, 1000);
}


function clearStopper() {
    var eltime = document.querySelector('.time');
    eltime.textContent = "00:00";
    gSeconds = 0; gMinutes = 0;
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fitPresent() {
    var elTable = document.querySelector('.table-container');
    var elNewGame = document.querySelector('.new-game');
    if (gBoard[0].length === 8) {
        elTable.style.marginTop = '180px';
        // elNewGame.style.marginTop = '5px';

    } else if (gBoard[0].length === 6) {
        elTable.style.marginTop = '150px';
        // elNewGame.style.marginTop = '5px';

    } else {
        elTable.style.marginTop = '120px';
        // elNewGame.style.marginTop = '15px';
    }
}

// to do: change when marked
// var elNumMinesl
// elNumMines = document.querySelector('.num-mines h5');
// console.log(elNumMines);
// var numMines=elNumMines.value;
// console.log(numMines);
// elNumMines.innerText=numMines-1;