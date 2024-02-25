
class HighScoreManager {
    constructor(scoreDisplayElement) {
        this.score = 0;
        this.highScoreList = new HighScoreList();
        this.scoreDisplay = new ScoreDisplay(scoreDisplayElement);
        this.scoreDecrementer = new ScoreDecrementer(this);
        this.highScoreList.load();
    }

    updateScoreDisplay() {
        this.scoreDisplay.update(this.score);
    }

    decrementScore() {
        if (this.score > 0) {
            this.score -= 1;
            this.updateScoreDisplay();
        }
    }

    saveHighScore(playerName) {
        this.highScoreList.update(playerName, this.score);
        this.displayHighScores();
    }

    displayHighScores() {
        const topScores = this.highScoreList.getTopScores();
        const highScoresList = document.getElementById('highScoresList');
        highScoresList.innerHTML = '<h3>High Scores:</h3>';

        if (topScores.length > 0) {
            topScores.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${entry.playerName}: ${entry.score}`;
                highScoresList.appendChild(listItem);
            });
        } else {
            highScoresList.innerHTML += '<h0>(No high scores yet)</h0>';
        }
    }

    clearHighScores() {
        this.highScoreList.clear();
        this.displayHighScores();
    }
}

class HighScoreEntry {
    constructor(playerName, score) {
        this.playerName = playerName;
        this.score = score;
    }
}

class HighScoreList {
    constructor() {
        this.highScores = [];
    }

    update(playerName, score) {
        const existingPlayerIndex = this.highScores.findIndex(entry => entry.playerName === playerName);

        if (existingPlayerIndex !== -1) {
            this.highScores[existingPlayerIndex].score = Math.max(this.highScores[existingPlayerIndex].score, score);
        } else {
            const newHighScore = new HighScoreEntry(playerName, score);
            this.highScores.push(newHighScore);
        }

        this.highScores.sort((a, b) => b.score - a.score);
        this.save();
    }

    save() {
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }

    load() {
        const storedHighScores = localStorage.getItem('highScores');
        if (storedHighScores) {
            this.highScores = JSON.parse(storedHighScores);
        }
    }

    clear() {
        localStorage.removeItem('highScores');
        this.highScores = [];
    }

    getTopScores(count = 10) {
        return this.highScores.slice(0, count);
    }
}

class ScoreDisplay {
    constructor(scoreDisplayElement) {
        this.scoreDisplayElement = scoreDisplayElement;
    }

    update(score) {
        this.scoreDisplayElement.textContent = 'Score: ' + score;
    }
}

class ScoreDecrementer {
    constructor(scoreManager) {
        this.scoreManager = scoreManager;
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => this.scoreManager.decrementScore(), 400);
    }

    stop() {
        clearInterval(this.interval);
    }
}

const scoreDisplayElement = document.getElementById('scoreDisplay');
const highScoreManager = new HighScoreManager(scoreDisplayElement);