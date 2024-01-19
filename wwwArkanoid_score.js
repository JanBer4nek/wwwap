let highScores = [];
let score = 0;
let scoreDecrementInterval;

const scoreDisplay = document.getElementById('scoreDisplay');
const highScoresList = document.getElementById('highScoresList');

function updateScoreDisplay() {
    scoreDisplay.textContent = 'Score: ' + score;

}

function decrementScore() {
    if (score > 0) {
        score -= 10;
        updateScoreDisplay();

    }
}

function saveHighScore(score, playerName) {
    const newHighScore = { score, playerName };
    highScores.push(newHighScore);
    highScores.sort((a, b) => b.score - a.score);

    localStorage.setItem('highScores', JSON.stringify(highScores));

}

function displayHighScores() {
    const storedHighScores = localStorage.getItem('highScores');
    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);

        highScoresList.innerHTML = '<h3>High Scores:</h3>';
        highScores.slice(0, 10).forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.playerName}: ${entry.score}`;
            highScoresList.appendChild(listItem);
        });
        
    } else {
        highScoresList.innerHTML = '<h3>High Scores:</h3><h0>(No high scores yet)</h0>';

    }
}

function clearHighScores() {
    localStorage.removeItem('highScores');
    highScores = [];
    highScoresList.innerHTML = '<h3>High Scores:</h3><h0>(No high scores yet)</h0>';

}

