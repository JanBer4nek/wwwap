
class GameObject {
    constructor(x, y, width, height, color, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ctx = ctx;
    }
}

class Ball extends GameObject {
    constructor(x, y, radius, color, ctx) {
        super(x, y, radius * 2, radius * 2, color, ctx);
        this.radius = radius;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Paddle extends GameObject {
    constructor(x, y, width, height, color, ctx) {
        super(x, y, width, height, color, ctx);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Brick extends GameObject {
    constructor(x, y, width, height, color, ctx) {
        super(x, y, width, height, color, ctx);
        this.status = 1;
    }

    draw() {
        if (this.status === 1) {
            this.ctx.beginPath();
            this.ctx.rect(this.x, this.y, this.width, this.height);
            this.ctx.fillStyle = 'purple';
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    static resetBricks(main) {
        const bricks = [];
        for (let c = 0; c < main.brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < main.brickRowCount; r++) {
                bricks[c][r] = new Brick(
                    c * (main.brickWidth + main.brickPadding) + main.brickOffsetLeft,
                    r * (main.brickHeight + main.brickPadding) + main.brickOffsetTop,
                    main.brickWidth,
                    main.brickHeight,
                    'purple',
                    main.ctx
                );
            }
        }
        return bricks;
    }
}

class GameRenderer {
    constructor(ctx, canvas, keyInputHandler, bricks, main) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.keyInputHandler = keyInputHandler;
        this.bricks = bricks;
        this.main = main;
        this.requestId = null;
    }

    drawBricks() {
        this.bricks.forEach(row => {
            row.forEach(brick => {
                brick.draw();
            });
        });
    }

    collisionDetection() {
        for (let c = 0; c < this.main.brickColumnCount; c++) {
            for (let r = 0; r < this.main.brickRowCount; r++) {
                const brick = this.bricks[c][r];
                if (brick.status === 1) {
                    const brickX = c * (this.main.brickWidth + this.main.brickPadding) + this.main.brickOffsetLeft;
                    const brickY = r * (this.main.brickHeight + this.main.brickPadding) + this.main.brickOffsetTop;

                    if (this.main.ball.x > brickX && this.main.ball.x < brickX + this.main.brickWidth && this.main.ball.y > brickY && this.main.ball.y < brickY + this.main.brickHeight) {
                        brick.status = 0;
                        this.main.ballSpeedY = -this.main.ballSpeedY;
                        highScoreManager.score += 100;
                        highScoreManager.updateScoreDisplay();
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBricks();
        this.main.ball.draw();
        this.main.paddle.draw();
        this.collisionDetection();

        if (this.keyInputHandler.rightPressed && this.main.paddle.x < this.canvas.width - this.main.paddle.width) {
            this.main.paddle.x += 2;

            } else if (this.keyInputHandler.leftPressed && this.main.paddle.x > 0) {
                this.main.paddle.x -= 2;
        }

        this.main.ball.x += this.main.ballSpeedX;
        this.main.ball.y += this.main.ballSpeedY;

        if (this.main.ball.x > this.canvas.width - this.main.ball.radius || this.main.ball.x < this.main.ball.radius) {
            this.main.ballSpeedX = -this.main.ballSpeedX;
        }

        if (this.main.ball.y < this.main.ball.radius) {
            this.main.ballSpeedY = -this.main.ballSpeedY;

            } else if (this.main.ball.y > this.canvas.height - this.main.ball.radius) {

                if (this.main.ball.x > this.main.paddle.x && this.main.ball.x < this.main.paddle.x + this.main.paddle.width) {
                    const relativeIntersectX = this.main.ball.x - (this.main.paddle.x + this.main.paddle.width / 2);
                    const normalizedRelativeIntersectX = relativeIntersectX / (this.main.paddle.width / 2);
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
            this.requestId = requestAnimationFrame(() => this.draw());
        }
    }

    initializeGame() {
        this.main.ball.x = this.canvas.width / 2;
        this.main.ball.y = this.canvas.height - 30;
        highScoreManager.score = 0;
        highScoreManager.updateScoreDisplay();
        this.main.ballSpeedX = 1.1;
        this.main.ballSpeedY = -1.1;
        this.bricks = Brick.resetBricks(this.main);
        this.main.paddleX = (this.canvas.width - this.main.paddleWidth) / 2;
        this.main.rightPressed = false;
        this.main.leftPressed = false;
        this.main.gameOver = false;
        this.main.startAnimation();
        highScoreManager.displayHighScores();
        this.draw();
        this.main.gameMenu.style.display = 'none';
        this.canvas.style.display = 'block';
        
        document.getElementById('gameOverText').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'block';
        document.getElementById('highScoresList').style.display = 'none';
        document.getElementById('clearHighScoresButton').style.display = 'none';
        document.getElementById('logOutButton').style.display = 'none';
    }
}

this.gameRenderer = new GameRenderer(this.ctx, this.canvas, this.keyInputHandler, this.main);