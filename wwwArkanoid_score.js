class HighScoreManager {
    constructor() {
        this.highScores = [];
        this.score = 0;
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.highScoresList = document.getElementById('highScoresList');
        this.scoreDecrementInterval = null;

        this.updateScoreDisplay();

        this.decrementScore = this.decrementScore.bind(this);
        this.saveHighScore = this.saveHighScore.bind(this);
        this.displayHighScores = this.displayHighScores.bind(this);
        this.clearHighScores = this.clearHighScores.bind(this);
    }

    updateScoreDisplay() {
        this.scoreDisplay.textContent = 'Score: ' + this.score;
    }

    decrementScore() {
        if (this.score > 0) {
            this.score -= 10;
            this.updateScoreDisplay();
        }
    }

    saveHighScore(playerName) {
        const existingPlayerIndex = this.highScores.findIndex(entry => entry.playerName === playerName);
    
        if (existingPlayerIndex !== -1) {
            this.highScores[existingPlayerIndex].score = Math.max(this.highScores[existingPlayerIndex].score, this.score);
        } else {
            const newHighScore = { playerName: playerName, score: this.score };
            this.highScores.push(newHighScore);
        }
    
        this.highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
        this.displayHighScores();
    }

    displayHighScores() {
        const storedHighScores = localStorage.getItem('highScores');
        if (storedHighScores) {
            this.highScores = JSON.parse(storedHighScores);
            this.highScoresList.innerHTML = '<h3>High Scores:</h3>';
            this.highScores.slice(0, 10).forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${entry.playerName}: ${entry.score}`;
                this.highScoresList.appendChild(listItem);
            });
        } else {
            this.highScoresList.innerHTML = '<h3>High Scores:</h3><h0>(No high scores yet)</h0>';
        }
    }

    clearHighScores() {
        localStorage.removeItem('highScores');
        this.highScores = [];
        this.highScoresList.innerHTML = '<h3>High Scores:</h3><h0>(No high scores yet)</h0>';
    }
}

const highScoreManager = new HighScoreManager();