const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore')

const highScores = JSON.parse(localStorage.getItem('highScores')) || []

const MAX_HIGH_SCORES = 5

finalScore.innerText = mostRecentScore

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value
})

saveHighScore = e => {
    e.preventDefault()

    const score = {
        score: mostRecentScore,
        name: username.value
    }

    // Ajoutez le score au tableau des scores
    highScores.push(score)

    // Trier les scores par ordre décroissant
    highScores.sort((a, b) => b.score - a.score)

    // Limiter le nombre de scores à MAX_HIGH_SCORES
    highScores.splice(MAX_HIGH_SCORES)

    // Sauvegarder les scores dans localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores))

    // Rediriger vers la page de classement
    window.location.assign('./highscores.html')
}
