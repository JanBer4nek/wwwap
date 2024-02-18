class KeyInputHandler {
    constructor() {
      this.rightPressed = false;
      this.leftPressed = false;
      this.keyDownHandler = this.keyDownHandler.bind(this);
      this.keyUpHandler = this.keyUpHandler.bind(this);
      document.addEventListener('keydown', this.keyDownHandler);
      document.addEventListener('keyup', this.keyUpHandler);
    }
  
    keyDownHandler(e) {
      if (e.key === 'd' || e.key === 'ArrowRight') {
        this.rightPressed = true;
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        this.leftPressed = true;
      }
    }
  
    keyUpHandler(e) {
      if (e.key === 'd' || e.key === 'ArrowRight') {
        this.rightPressed = false;
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        this.leftPressed = false;
      }
    }
}
  
this.keyInputHandler = new KeyInputHandler();