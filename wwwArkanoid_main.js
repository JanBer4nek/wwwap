const canvas = document.getElementById('arkanoidCanvas');
const gameMenu = document.getElementById('gameMenu');
const startButton = document.getElementById('startButton');
const ctx = canvas.getContext('2d');
let currentUsername;

let ballX, ballY, ballSpeedX, ballSpeedY;

const paddleHeight = 10;
const paddleWidth = 130;
let paddleX;

let rightPressed = false;
let leftPressed = false;
let gameOver = true;

const brickRowCount = 5;
const brickColumnCount = 8;
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
document.getElementById('clearHighScoresButton').style.display = 'none';

function startGame() {
    const role = document.getElementById('role').value;

    if (role === 'member') {
        currentUsername = document.getElementById('username').value.trim();
        initializeGame();
    } else {
        initializeGame();

    }
}

function startAnimation() {
    requestId = requestAnimationFrame(draw);

}

function initializeGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    score = 0;
    ballSpeedX = 1.1;
    ballSpeedY = -1.1;
    resetBricks();
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    gameOver = false;
    startAnimation();
    displayHighScores();
    draw();
    gameMenu.style.display = 'none';
    canvas.style.display = 'block';
    scoreDecrementInterval = setInterval(decrementScore, 2000);
    document.getElementById('gameOverText').style.display = 'none';
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('highScoresList').style.display = 'none';
    document.getElementById('clearHighScoresButton').style.display = 'none';
    document.getElementById('logOutButton').style.display = 'none';
    
}

function endGame() {
    const role = document.getElementById('role').value;

    if (role === 'guest') {
        currentUsername = 'guest';
    }

    if (currentUsername === undefined) {
        currentUsername = prompt('Enter your name:');
    }

    if (currentUsername === null || currentUsername === '') {
        currentUsername = 'admin';
    }

    if (role === 'admin') {
        document.getElementById('clearHighScoresButton').style.display = 'block';
    }

    const playerScore = { name: currentUsername, score: score };

    ballSpeedX = 0;
    ballSpeedY = 0;
    gameMenu.style.display = 'block';
    canvas.style.display = 'none';
    gameOver = true;
    rightPressed = false;
    leftPressed = false;
    cancelAnimationFrame(requestId);
    clearInterval(scoreDecrementInterval);
    saveHighScore(playerScore.score, playerScore.name);
    displayHighScores();
    document.getElementById('highScoresList').style.display = 'block';
    document.getElementById('gameOverText').style.display = 'block';
    document.getElementById('logOutButton').style.display = 'block';

}