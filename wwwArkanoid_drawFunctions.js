let requestId;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'purple';
                ctx.fill();
            }
        }
    }
}

function resetBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { status: 1 };
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1 && ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                ballSpeedY = -ballSpeedY;
                b.status = 0;
                score += 100;
                updateScoreDisplay();

            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 2;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 2;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width - 10 || ballX < 10) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY < 10) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY > canvas.height - 10) {

        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            const relativeIntersectX = ballX - (paddleX + paddleWidth / 2);
            const normalizedRelativeIntersectX = relativeIntersectX / (paddleWidth / 2);
            const bounceAngle = normalizedRelativeIntersectX * Math.PI / 3;

            ballSpeedX = 1.5 * Math.sin(bounceAngle);
            ballSpeedY = -1.5 * Math.cos(bounceAngle);
        } else {
            endGame();
        }
    }

    if (bricks.every(row => row.every(brick => brick.status === 0))) {
        endGame();
    }
    
    if (!gameOver) {
        requestId = requestAnimationFrame(draw);
    }
}