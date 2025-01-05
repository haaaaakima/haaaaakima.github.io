const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

const SCORE_POINTS = 100
const MAX_QUESTIONS = 4

// Fonction pour récupérer des devinettes depuis l'API
const fetchQuestionsFromAPI = async () => {
    try {
        // API qui récupère des devinettes
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple');
        const data = await response.json();

        // Transformer les questions en format adapté au quiz
        return data.results.map(questionData => ({
            question: questionData.question, // La question de devinette
            choice1: questionData.correct_answer, // La bonne réponse
            choice2: questionData.incorrect_answers[0], 
            choice3: questionData.incorrect_answers[1],
            choice4: questionData.incorrect_answers[2],
            answer: 1, // L'index de la bonne réponse (ici, c'est la 1ère)
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération des questions:", error);
        return [];
    }
}

// Démarrer le jeu en récupérant les questions de l'API
startGame = async () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = await fetchQuestionsFromAPI();  // Récupérer les questions depuis l'API
    if (availableQuestions.length > 0) {
        getNewQuestion();
    } else {
        alert("Pas de questions disponibles, essayez plus tard.");
    }
}

// Obtenir une nouvelle question
getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('./end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // Récupérer la première question
    currentQuestion = availableQuestions[0];
    question.innerText = currentQuestion.question;

    // Créer un tableau des choix avec la bonne réponse et les réponses incorrectes
    const allChoices = [
        currentQuestion.choice1,
        currentQuestion.choice2,
        currentQuestion.choice3,
        currentQuestion.choice4,
    ];

    // Mélanger les choix
    const shuffledChoices = shuffleArray(allChoices);

    // Réattribuer la bonne réponse
    currentQuestion.answer = shuffledChoices.indexOf(currentQuestion.choice1);

    // Assigner les réponses mélangées aux éléments HTML
    choices.forEach((choice, index) => {
        choice.innerText = shuffledChoices[index];
        choice.dataset['number'] = index;
    });

    // Supprimer la question utilisée
    availableQuestions.splice(0, 1);
    acceptingAnswers = true;
}

// Mélange d'un tableau (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
    }
    return array;
}

// Événement pour chaque choix
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // Appliquer la classe pour marquer la réponse correcte ou incorrecte
        if (selectedAnswer == currentQuestion.answer) {
            selectedChoice.parentElement.classList.add('correct');  // Mettre la bonne réponse en vert
            incrementScore(SCORE_POINTS);  // Ajouter des points
        } else {
            selectedChoice.parentElement.classList.add('incorrect'); // Mettre la réponse incorrecte en rouge
            // Montrer la bonne réponse (en vert)
            choices.forEach(choice => {
                if (choice.dataset['number'] == currentQuestion.answer) {
                    choice.parentElement.classList.add('correct');  // Mettre la bonne réponse en vert
                }
            });
        }

        // Attendre avant de passer à la question suivante
        setTimeout(() => {
            choices.forEach(choice => {
                choice.parentElement.classList.remove('correct', 'incorrect');  // Nettoyer les classes
            });
            getNewQuestion();
        }, 1000);
    });
});

// Ajouter les points au score
incrementScore = num => {
    score += num;
    scoreText.innerText = score;  // Mise à jour de l'affichage du score
}

startGame();
