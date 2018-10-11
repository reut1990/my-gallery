'use strict;'

const MINE = '💣';
const FLAG = '🚩';
const SAD_SMILEY = '😵';
const VICTORY_SMILEY = '😍';
const NORMAL_SMILEY = '😊';

var gBoard, gState, gTimeInterval, gSeconds, gMinutes,
    gStartTouch, gEndTouch;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

localStorage.setItem('easySec', Infinity);
localStorage.setItem('mediumSec', Infinity);
localStorage.setItem('hardSec', Infinity);

//This is called when page loads
function initGame() {

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = NORMAL_SMILEY;
    var elNumMines = document.querySelector('.num-mines h5');
    elNumMines.innerText = '0' + gLevel.MINES;

    gBoard = buildBoard();
    gState = {
        isGameOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    document.oncontextmenu = function () { return false; };
    gTimeInterval = false;
    setMines(gBoard);
    clearStopper();
    renderBoard();
}

// To set new level
function levelInit(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    clearTimeout(gTimeInterval);
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
            strHTML += `<td class="${className}" 
                            onclick="cellClicked(this, ${i},${j})"
                            oncontextmenu="cellMarked(${i},${j})">${cell}</td>`;
                            // ontouchstart="touchStart(event)"  ontouchend="touchEnd(event)"
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
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.classList.add('design');
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
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isMine = false;
            if (j - 1 < 0) {// if it has alraedy mines???
                gBoard[i][j + 1].isMine = true;
            } else {
                gBoard[i][j - 1].isMine = true;
            }
        }
    }
    setMinesNegsCount(gBoard);

    if (gState.isGameOn && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) {

        var cell;
        if (gBoard[i][j].isMine) {
            cell = MINE;
            updateCellData(elCell, cell, i, j);
        } else if (gBoard[i][j].minesAroundCount >= 1) {
            cell = gBoard[i][j].minesAroundCount;
            updateCellData(elCell, cell, i, j);
        } else {
            expandShown(gBoard, i, j);
        }
        checkMineClicked(elCell, i, j);
        checkGameOver(elCell, i, j);
    }

}

// update the DOM-SET BOBM/NUM-NEIGHBOURS and modal
function updateCellData(elCell, cell, i, j) {//fixed
    elCell.innerText = cell;
    elCell.style.background = 'lightgrey';
    gBoard[i][j].isShown = true;
    gState.shownCount++;
}

//check if the cell clicked is mine
//if so,  expose all cells that are mines
//and prints game over 
function checkMineClicked(elCell, i, j) {

    var elMine;

    if (gBoard[i][j].isMine) {
        var elSmiley = document.querySelector('.smiley');
        var elMessege = document.querySelector('.messege');
        elSmiley.innerText = SAD_SMILEY;
        elCell.style.border = '3px solid red';
        elCell.style.background = 'pink';

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
function cellMarked(i, j) {

    // vars for updating num of mines left to mark
    var elNumMines = document.querySelector('.num-mines h5');
    var numMines = +elNumMines.innerText;

    var elCell = document.querySelector(`.cell-${i}-${j}`);
    if (gState.markedCount < gLevel.MINES && gState.isGameOn && !gBoard[i][j].isMarked
        && !gBoard[i][j].isShown) {
        if (!gTimeInterval) {
            timer();
        }
        gState.markedCount++;
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        //updating num of mines left to mark
        elNumMines.innerText = numMines - 1;
        //WHEN CELL ALREADY MARKED
    } else if (gBoard[i][j].isMarked && gState.isGameOn) {
        gState.markedCount--;
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        elNumMines.innerText = numMines + 1;
    }
    checkGameOver(elCell, i, j);
}


// function touchStart(event) {
//     var gStartTouch = new Date().getTime();
//     // var gStartTouch = Date.now();
// }

// function touchEnd(event){
//     console.log(56)
// }

// function touchEnd(event) {
//     var gEndTouch = new Date().getTime();
//     //IN PHONES-IF THE USER TOUCH FOR A SECOND or more IT MARK THE CELL
//     var time = +gEndTouch - +gStartTouch;
//     console.log({time});
//     // debugger;
//     if (time >= 1000 && gState.isGameOn) {
//         var elCell = event.target;
//         var cellClasses = elCell.classList;
//         var cellClass = cellClasses[1];
//         var arrayClass = cellClass.split('-');
//         var cellIndexI = arrayClass[1];
//         var cellIndexJ = arrayClass[2];
//         cellMarked(cellIndexI, cellIndexJ);
//     }
// }


//Game ends when all mines are marked and all the other 
//cells are shown OR user click one mine
function checkGameOver(elCell, cellI, cellJ) {
    var elMessege = document.querySelector('.messege');
    var elSmiley = document.querySelector('.smiley');

    if (gState.shownCount + gState.markedCount === gLevel.SIZE * gLevel.SIZE) {
        //If last cell clicked is mine and not marked
        //game ends (In other function it is being exposed)
        if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked) {
            gState.isGameOn = false;
            clearTimeout(gTimeInterval);
        } else {
            // If last cell not MINE-victory
            gState.isGameOn = false;
            clearTimeout(gTimeInterval);
            elMessege.innerText = 'VICTORY!!!! ' + VICTORY_SMILEY;
            elSmiley.innerText = VICTORY_SMILEY;
            setBestTimeOnDOM()
        }

    }
}

// Show the best score on the DOM in the end of the game
function setBestTimeOnDOM() {
    var time;
    var level = 'easy';
    if (gLevel.SIZE === 6) level = 'medium';
    else if (gLevel.SIZE === 8) level = 'hard';
    time = +localStorage.getItem(`${level}Sec`);
    if (gState.secsPassed < time) {
        localStorage.setItem(`${level}Sec`, gState.secsPassed);
        document.querySelector(`.${level} span`).innerText = gState.secsPassed + 's';
    }
}


//If EMPTY CELL REVEAL ALL EMPTY -LIKE IN THE REAL GAME
function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isShown || board[i][j].isMarked || board[i][j].isMine) continue;
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            var cell = board[i][j].minesAroundCount;
            updateCellData(elCell, cell, i, j);
            if (board[i][j].minesAroundCount === '') expandShown(board, i, j);
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






