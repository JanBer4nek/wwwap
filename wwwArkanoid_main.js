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
        
        this.scoreDecrementer = new ScoreDecrementer(highScoreManager);
        this.keyInputHandler = new KeyInputHandler();
        this.gameRenderer = new GameRenderer(this.ctx, this.canvas, this.keyInputHandler, this.bricks, this);
        this.ball = new Ball(this.ballX, this.ballY, 10, 'blue', this.ctx); 
        this.paddle = new Paddle(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight, 'blue', this.ctx);

        this.startButton.addEventListener('click', () => this.startGame());
    }

    startGame() {
        const role = document.getElementById('role').value;
        this.scoreDecrementer.start();

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

        if (this.currentUsername === null || this.currentUsername === '') {
            this.currentUsername = 'admin';
        }

        if (role === 'admin') {
            this.currentUsername = 'admin';
            document.getElementById('clearHighScoresButton').style.display = 'block';
        }

        this.gameOver = true;
        cancelAnimationFrame(this.requestId);
        this.gameMenu.style.display = 'block';
        this.canvas.style.display = 'none';
        highScoreManager.saveHighScore(this.currentUsername);
        document.getElementById('gameOverText').style.display = 'block';
        document.getElementById('scoreDisplay').style.display = 'block';
        document.getElementById('highScoresList').style.display = 'block';
        document.getElementById('logOutButton').style.display = 'block';
        this.scoreDecrementer.stop();

    }
}

const main = new Main();