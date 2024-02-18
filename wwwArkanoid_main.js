class Main {
    constructor() {
        this.canvas = document.getElementById('arkanoidCanvas');
        this.gameMenu = document.getElementById('gameMenu');
        this.startButton = document.getElementById('startButton');
        this.ctx = this.canvas.getContext('2d');
        this.currentUsername = null;

        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height - 30;
        this.ballSpeedX = 1.1;
        this.ballSpeedY = -1.1;

        this.paddleHeight = 10;
        this.paddleWidth = 130;
        this.paddleX = (this.canvas.width - this.paddleWidth) / 2;

        this.rightPressed = false;
        this.leftPressed = false;
        this.gameOver = true;

        this.brickRowCount = 5;
        this.brickColumnCount = 8;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;

        this.bricks = [];

        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { status: 1 };
            }
        }

        this.keyInputHandler = new KeyInputHandler();
        this.gameRenderer = new GameRenderer(this.ctx, this.canvas, this.keyInputHandler, this.bricks, this);

        document.getElementById('clearHighScoresButton').style.display = 'none';

        this.startButton.addEventListener('click', () => this.startGame());
    }

    startGame() {
        const role = document.getElementById('role').value;

        if (role === 'member') {
            this.currentUsername = document.getElementById('username').value.trim();
            this.gameRenderer.initializeGame();
        } else {
            this.gameRenderer.initializeGame();
        }
    }

    startAnimation() {
        this.requestId = requestAnimationFrame(() => this.gameRenderer.draw());
    }

    endGame() {
        const role = document.getElementById('role').value;

        if (role === 'guest') {
            this.currentUsername = 'guest';
        }

        if (this.currentUsername === undefined) {
            this.currentUsername = prompt('Enter your name:');
        }

        if (this.currentUsername === null || this.currentUsername === '') {
            this.currentUsername = 'admin';
        }

        if (role === 'admin') {
            document.getElementById('clearHighScoresButton').style.display = 'block';
        }

        const playerScore = { name: this.currentUsername, score: highScoreManager.score };

        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.gameMenu.style.display = 'block';
        this.canvas.style.display = 'none';
        this.gameOver = true;
        this.rightPressed = false;
        this.leftPressed = false;
        cancelAnimationFrame(this.requestId);
        clearInterval(highScoreManager.scoreDecrementInterval);
        highScoreManager.saveHighScore(playerScore.name);
        highScoreManager.displayHighScores();
        document.getElementById('highScoresList').style.display = 'block';
        document.getElementById('gameOverText').style.display = 'block';
        document.getElementById('logOutButton').style.display = 'block';
        document.getElementById('scoreDisplay').style.display = 'block';

    }
}

const main = new Main();