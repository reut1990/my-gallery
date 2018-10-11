const WALL = 'WALL';
const FLOOR = 'FLOOR';//  fix=glue also with mouse!
const BALL = 'BALL';
const GLUE = 'GLUE';
const GAMER = 'GAMER';
var smiley='🙏';
console.log(smiley);

const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/glue.png">';


var gGamerPos;
var gBoard;
var gCountBallsCollected = 0;
var gBool = true;

function init() {
	gGamerPos = { i: 2, j: 5 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	setElement();
}

function resetGame() {
	document.querySelector('.win-container').classList.remove('show');
	init();
	var elballsMessage = document.querySelector('.balls');
	elballsMessage.innerText = 0;
}

function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	//Creat Passages
	cell = { type: FLOOR, gameElement: null };
	board[0][5] = cell;
	board[9][5] = cell;
	board[5][0] = cell;
	board[5][11] = cell;

	console.log(board);
	return board;
}


function setElement() {
	gRenderElements = setInterval(renderElements, 2000);
}


function renderElements() {
	var random = Math.random();
	var el, EL_IMG;
	var randomRowIndex = getRandomIntInclusive(1, 8);
	var randomColIndex = getRandomIntInclusive(1, 10);

	if (random > 0.5) {
		el = BALL;
		EL_IMG = BALL_IMG;
	} else {
		el = GLUE;
		EL_IMG = GLUE_IMG;
	}
	var elCell;
	if (gBoard[randomRowIndex][randomColIndex].gameElement === null) {
		gBoard[randomRowIndex][randomColIndex].gameElement = el;
		elCell = document.querySelector('.cell-' + randomRowIndex + '-' + randomColIndex);
		elCell.innerHTML = EL_IMG;
	}
}

function checkWin(board) {
	var isWon = true;
	for (var i = 0; i < board.length - 1; i++) {
		for (var j = 0; j < board[0].length - 1; j++) {
			if (board[i][j].gameElement === BALL) {
				isWon = false; break;
			}
		}
	}
	return isWon;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += '\t' + GAMER_IMG + '\n';
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	
	var targetCell = gBoard[i][j];
	var eat = new Audio('sounds/yeay.mp3');
	if (targetCell.type === WALL) return;
	if (!gBool) return;



	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) ||
		(i === 5 && j === 0) || (i === 5 && j === 11) || (i === 0 && j === 5) || (i === 9 && j === 5)) {

		//CollectingBalls
		var elballsMessage = document.querySelector('.balls');
		if (targetCell.gameElement === BALL) {
			gCountBallsCollected++;
			eat.play();
			elballsMessage.innerText = gCountBallsCollected;
		}

		//check wining
		var isWining = checkWin(gBoard);
		if (isWining) {
			clearInterval(gRenderElements);
			var elWin = document.querySelector('.win-container');
			elWin.classList.add('show');
			// document.querySelector('.reset').classList.add('show');
		}


		// MOVING
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

		// if (targetCell.gameElement === GLUE) {-ANOTHER WAY TO THE GLUE
		// moveTo(i, j); 
		//      gbool=false;

		// setTimeout(function () {	
		//   gBool=true;
		// }, 2000);
		//   gBool=true;
		// }


	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

// I WROTE THE PASSAGES WITH SPECIPIC NUMS, BETTER TO WRITE--------------
//IF I===0 / J===0/ I.MAT.LENGTH-1/J.MAT.LENGTH-1
// MOVE TO THE SAME LINE OR J 
//END OF LINE OR ROW

	switch (event.key) {
		case 'ArrowLeft':
			if (j === 0 && i===5) {
				moveTo(5, 11);
			} if (gBoard[i][j - 1].gameElement === 'GLUE') {
				moveTo(i, j - 1);
				movingTimer();
			} else {
				moveTo(i, j - 1);
			}
			break;
		case 'ArrowRight':
			if (j === 11 && i===5) {
				moveTo(5, 0);
			} if (gBoard[i][j + 1].gameElement === 'GLUE') {
				moveTo(i, j + 1);
				movingTimer();
			} else {
				moveTo(i, j + 1);
			}
			break;
		case 'ArrowUp':
			if (i === 0 && j === 5) {
				moveTo(9, 5);
			} if (gBoard[i - 1][j].gameElement === 'GLUE') {
				moveTo(i - 1, j);
				movingTimer();
			} else {
				moveTo(i - 1, j);
			}
			break;
		case 'ArrowDown':
			if (i === 9 && j === 5) {
				moveTo(0, 5);
			} if (gBoard[i + 1][j].gameElement === 'GLUE') {
				moveTo(i + 1, j);
				movingTimer();
			} else {
				moveTo(i + 1, j);
			}
			break;
	}
}

//movingTimer
function movingTimer() {
	gBool = false;
	setTimeout(function () {
		gBool = true;
	}, 2000);
}


// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}