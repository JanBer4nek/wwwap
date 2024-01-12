function keyDownHandler(e) {
    if (e.key === 'd' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'd' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}