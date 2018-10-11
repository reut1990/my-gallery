// creat 2d array, matrix
function buildBoard() {
    // Create the Matrix
    var board = new Array(10);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(12);
    }
}

//present board game(html table)
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            strHTML += '<td>'
            strHTML += board[i][j]
            strHTML += '</td>'
        }
        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;


    console.log(elBoard);
}
//init game
function init() {
    gBoard = createBoard();
    renderBoard(gBoard)
    gIsGameOn = true;
    if (gGameInterval) clearInterval(gGameInterval)
    gGameInterval = setInterval(play, GAME_FREQ);
}

//playyyyy
function play() {
    gBoard = runGeneration(gBoard);
    renderBoard(gBoard);
}


//copy mat
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

//count neighbours
function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j] === LIFE) neighborsSum++;
        }
    }
    return neighborsSum;
}

// random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//get time
function getTime() {
    return new Date().toString().split(' ')[4];
}

// create object map
map = {};
for (var i = 0; i < words.length; i++) {
    if (words[i] in map) {
        map[words[i]]++; // PAY ATTENTION TO THE SYNTEX
    } else {
        map[words[i]] = 1;
    }
}

// sort by value
byGrade.sort(function (a, b) {
    return a.value - b.value;
});
return byGrade;


(Math.random() > 0.5) ? LIFE : ''

// 55. Fill up a 2d array with numbers Create 
//the following functions:
// • sumCol(mat, colIdx)
// • sumRow(mat, rowIdx)
// • findMax(mat ,colIdx)
// • findAvg(mat)
// • sumArea(mat, rowIdxStart, rowIdxEnd, coldxStart, colIdxEnd)


function sumArea(mat, rowIdxStart, rowIdxEnd,
    coldxStart, colIdxEnd) {
    var sum = 0;
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = coldxStart; j <= colIdxEnd; j++) {
            sum += mat[i][j];
        }
    }
    return sum;
}

function findAvg(mat) {
    var numRowCells = mat[0].length;
    var numColCells = mat.length;
    var countCells = numRowCells * numColCells;
    var sum = 0;
    for (var i = 0; i < numRowCells; i++) {
        sum += sumRow(mat, i);
    }
    var avg = sum / countCells;
    return avg;
}

function findMax(mat, colIdx) {
    var colArray = [];
    for (var i = 0; i < mat.length; i++) {
        colArray.push(mat[i][colIdx]);
    }
    console.log(colArray);
    var maxInCol = Math.max(...colArray);
    return maxInCol;

}

function sumCol(mat, colIdx) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][colIdx];
    }
    console.log('sum of col', colIdx + 1, 'is:', sum);
}


function sumRow(mat, rowIdx) {
    var row = mat[rowIdx];
    var sum = 0;
    for (var j = 0; j < row.length; j++) {
        sum += row[j];
    }
    return sum;
}



// A symmetric matrix is one that follow the rule: 
//mat[i][j] === mat[j][i]

//interval ways
if (gGameInterval) clearInterval(gGameInterval)
gGameInterval = setInterval(play, GAME_FREQ);

if (!gSecsInterval) {
}













/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRandomWord() {
    var letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
    var word = '';
    var wordSize = getRandomInt(3, 5);
    for (var i = 0; i < wordSize; i++) {
        var randIndex = getRandomInt(0, letters.length - 1);
        word += letters[randIndex];
    }
    return word;
}

function isPrime(num) {
    var divider = 2;
    var limit = Math.sqrt(num);
    var isPrimeNum = true;
    //console.log('Checking: ', num);
    while (isPrimeNum && divider <= limit) {

        // if the num is devided by the current divider - it is not a prime
        if (num % divider === 0) {
            //console.log('Not a Prime! found devider:', divider);
            isPrimeNum = false;
        } else {
            divider++;
        }
    }
    return isPrimeNum;
}

function groupBy(objs, prop) {
    var propToObjsMap = objs.reduce(function (accumulator, obj) {
        if (accumulator[obj[prop]] === undefined) {
            accumulator[obj[prop]] = [obj];
        } else {
            accumulator[obj[prop]].push(obj);
        }
        return accumulator;
    }, {});

    return propToObjsMap;
}


function sumMat(mat) {
    return mat.reduce(function (acc, row) {
        var sumRow = row.reduce(function (acc, num) {
            return acc + num;
        }, 0);
        return acc + sumRow;
    }, 0);
}


//     // function saveToStorage(key, value) {
//     //     localStorage[key]= JSON.stringify(value);
//     // }

//     // function getFromStorage(key) {
//     //     return JSON.parse(localStorage[key]);
// }
