// • User should click the buttons in a sequence (1, 2, 3,… 16)
// • When user clicks the a button - call a function cellClicked
//(numClicked)
// o If right – the button changes its color
// o When user clicks the wrong button noting happen
// • When user clicks the first number, game time starts and presented (3 digits after the dot, like in: 12.086)
// • Add difficulties (larger boards: 25, 36)


'use strict;'

var gTableSize;//slove this- maxNum-try it-take its sqrt
var gNumbers;//slove this- maxNum-try it
var gCount = 0;//slove this- maxNum-try it
var gCountCellClicks = 0;//option1
var gPrevNum=-1
var gSeconds = 0, gMinutes = 0, t;


function levelInit(size) {
    gCountCellClicks = 0;//option1
    gCount = 0;
    gPrevNum=-1;
    gTableSize = size;
    gNumbers = [];
    for (var i = 0; i < size * size; i++) {
        gNumbers.push(i + 1);
    }
    clearTimeout(t);
    clearStopper();
    fitPresent();
    renderBoard();
}

function newGame() {
    levelInit(gTableSize);
}

function createTableBoard() {
    var strHTML = '';
    for (var i = 0; i < gTableSize; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gTableSize; j++) {
            strHTML += `<td onclick="cellClicked(this)">`
            strHTML += getNum();
            strHTML += '</td>'
        }
        strHTML += '</tr>';
    }
    return strHTML;
}

function renderBoard() {
    var strHTML = createTableBoard();
    var elBoard = document.querySelector('.table-body');
    elBoard.innerHTML = strHTML;
}
//I created two possibilitrs for timer to start
//1. when user click on a first cell
//2. when user clicked on num 1 
function cellClicked(elNumClicked) {
    // var numClicked = +elNumClicked.textContent;
    var numClicked = +elNumClicked.innerText;
    console.log(numClicked, typeof numClicked);

    gCountCellClicks++;  //option1
    if (gCountCellClicks === 1) {//option1
        timer();//option1
    } //option1

    if (numClicked === 1) {
        elNumClicked.style.background = '#FA8072';
        gPrevNum = 1;
        gCount++;
        // timer();
        console.log('gCount', gCount, 'gPrevNum', gPrevNum);
    } else if (gPrevNum + 1 === numClicked) {
        gCount++;
        gPrevNum = numClicked;
        elNumClicked.style.background = '#FA8072';
        console.log('gCount', gCount, 'gPrevNum', gPrevNum);
    } else {
        gCount = gCount;
        console.log('gCount', gCount, 'gPrevNum', gPrevNum);
    }
    if (gCount === gTableSize * gTableSize) {
        console.log(gCount, gTableSize * gTableSize);
        clearTimeout(t);
    }
}

function add() {
    gSeconds++;
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
    t = setTimeout(add, 1000);
}

function clearStopper() {
    var eltime = document.querySelector('.time');
    eltime.textContent = "00:00";
    gSeconds = 0; gMinutes = 0;
}


function fitPresent() {
    var elTable = document.querySelector('.table-container');
    var elReturnBtn = document.querySelector('.return-btn');
    if (gTableSize === 6) {
        elTable.style.marginTop = '200px';
        elReturnBtn.style.marginTop = '440px';

    } else if (gTableSize === 5) {
        elTable.style.marginTop = '180px';
        elReturnBtn.style.marginTop = '400px';

    } else {
        elTable.style.marginTop = '150px';
        elReturnBtn.style.marginTop = '330px';
    }
}

function getNum() {
    var randomIndex = getRandomIntInclusive(0, gNumbers.length - 1);
    var num = gNumbers[randomIndex];
    gNumbers.splice(randomIndex, 1);
    return num;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
