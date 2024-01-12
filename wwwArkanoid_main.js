const canvas = document.getElementById('arkanoidCanvas');
const gameMenu = document.getElementById('gameMenu');
const startButton = document.getElementById('startButton');
const ctx = canvas.getContext('2d');

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 2;
let ballSpeedY = -2;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
let gameOver = true;

const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

startButton.addEventListener('click', startGame);

function startGame() {
    gameMenu.style.display = 'none';
    canvas.style.display = 'block';
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 2;
    ballSpeedY = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    gameOver = false;
    draw();
    resetBricks();
}

function endGame() {
    ballSpeedX = 0;
    ballSpeedY = 0;
    gameMenu.style.display = 'block';
    canvas.style.display = 'none';
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    gameOver = true;
    rightPressed = false;
    leftPressed = false;
}