class GameRenderer {
    constructor(ctx, canvas, keyInputHandler, bricks, main) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.keyInputHandler = keyInputHandler;
        this.bricks = bricks;
        this.main = main;
        this.requestId = null;
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.main.ballX, this.main.ballY, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.main.paddleX, this.canvas.height - this.main.paddleHeight, this.main.paddleWidth, this.main.paddleHeight);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
    }

    drawBricks() {
        for (let c = 0; c < this.main.brickColumnCount; c++) {
            for (let r = 0; r < this.main.brickRowCount; r++) {
                if (this.bricks[c][r].status === 1) {
                    const brickX = c * (this.main.brickWidth + this.main.brickPadding) + this.main.brickOffsetLeft;
                    const brickY = r * (this.main.brickHeight + this.main.brickPadding) + this.main.brickOffsetTop;

                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.main.brickWidth, this.main.brickHeight);
                    this.ctx.fillStyle = 'purple';
                    this.ctx.fill();
                }
            }
        }
    }

    resetBricks() {
        for (let c = 0; c < this.main.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.main.brickRowCount; r++) {
                this.bricks[c][r] = { status: 1 };
            }
        }
    }

    collisionDetection() {
        for (let c = 0; c < this.main.brickColumnCount; c++) {
            for (let r = 0; r < this.main.brickRowCount; r++) {
                const brick = this.bricks[c][r];
                if (brick.status === 1) {
                    const brickX = c * (this.main.brickWidth + this.main.brickPadding) + this.main.brickOffsetLeft;
                    const brickY = r * (this.main.brickHeight + this.main.brickPadding) + this.main.brickOffsetTop;

                    if (this.main.ballX > brickX && this.main.ballX < brickX + this.main.brickWidth && this.main.ballY > brickY && this.main.ballY < brickY + this.main.brickHeight) {
                        brick.status = 0;
                        this.main.ballSpeedY = -this.main.ballSpeedY;
                        highScoreManager.score += 50;
                        highScoreManager.updateScoreDisplay();
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.collisionDetection();

        if (this.keyInputHandler.rightPressed && this.main.paddleX < this.canvas.width - this.main.paddleWidth) {
            this.main.paddleX += 2;
        } else if (this.keyInputHandler.leftPressed && this.main.paddleX > 0) {
            this.main.paddleX -= 2;
        }

        this.main.ballX += this.main.ballSpeedX;
        this.main.ballY += this.main.ballSpeedY;

        if (this.main.ballX > this.canvas.width - 10 || this.main.ballX < 10) {
            this.main.ballSpeedX = -this.main.ballSpeedX;
        }

        if (this.main.ballY < 10) {
            this.main.ballSpeedY = -this.main.ballSpeedY;
        } else if (this.main.ballY > this.canvas.height - 10) {
            if (this.main.ballX > this.main.paddleX && this.main.ballX < this.main.paddleX + this.main.paddleWidth) {
                const relativeIntersectX = this.main.ballX - (this.main.paddleX + this.main.paddleWidth / 2);
                const normalizedRelativeIntersectX = relativeIntersectX / (this.main.paddleWidth / 2);
                const bounceAngle = normalizedRelativeIntersectX * Math.PI / 3;

                this.main.ballSpeedX = 1.5 * Math.sin(bounceAngle);
                this.main.ballSpeedY = -1.5 * Math.cos(bounceAngle);
            } else {
                this.main.endGame();
            }
        }

        if (this.bricks.every(row => row.every(brick => brick.status === 0))) {
            this.main.endGame();
        }

        if (!this.main.gameOver) {
            this.requestId = requestAnimationFrame(this.draw.bind(this));
        }
    }

    initializeGame() {
        this.main.ballX = this.canvas.width / 2;
        this.main.ballY = this.canvas.height - 30;
        highScoreManager.score = 0;
        this.main.ballSpeedX = 1.1;
        this.main.ballSpeedY = -1.1;
        this.resetBricks(this.bricks);
        this.resetBricks();
        this.main.paddleX = (this.canvas.width - this.main.paddleWidth) / 2;
        this.main.rightPressed = false;
        this.main.leftPressed = false;
        this.main.gameOver = false;
        this.main.startAnimation();
        highScoreManager.displayHighScores();
        this.draw();
        this.main.gameMenu.style.display = 'none';
        this.canvas.style.display = 'block';
        if (highScoreManager.scoreDecrementInterval) {
            clearInterval(highScoreManager.scoreDecrementInterval);
        }
        highScoreManager.scoreDecrementInterval = setInterval(highScoreManager.decrementScore, 2000);

        document.getElementById('gameOverText').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'block';
        document.getElementById('highScoresList').style.display = 'none';
        document.getElementById('clearHighScoresButton').style.display = 'none';
        document.getElementById('logOutButton').style.display = 'none';
    }
}

this.gameRenderer = new GameRenderer(this.ctx, this.canvas, this.keyInputHandler, this.bricks, this.main);