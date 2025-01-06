const question = document.querySelector('#question');
const progressText = document.querySelector('#progressText');
const progressBarFull = document.querySelector('#progressBarFull');
const nextButton = document.querySelector('#nextButton'); // Bouton pour passer à la devinette suivante

let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];

const MAX_QUESTIONS = 5; // Limite de questions

// Fonction pour récupérer des devinettes depuis l'API JokeAPI
const fetchQuestionsFromAPI = async () => {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?lang=fr&type=twopart&format=json&amount=5');
        const data = await response.json();

        if (data && data.jokes) {
            return data.jokes.map(joke => {
                if (joke.type === 'twopart') {
                    return {
                        question: joke.setup,         // La question de la devinette
                        answer: joke.delivery,        // La réponse correcte
                    };
                }
            }).filter(Boolean);  // Retirer les éléments invalides
        } else {
            console.log("Aucune devinette valide");
            return [];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des devinettes:", error);
        return [];
    }
};

// Démarrer le jeu
const startGame = async () => {
    questionCounter = 0;
    availableQuestions = await fetchQuestionsFromAPI();  // Récupérer les devinettes depuis l'API
    if (availableQuestions.length > 0) {
        getNewQuestion();
    } else {
        alert("Pas de devinettes disponibles, essayez plus tard.");
    }
};

// Obtenir une nouvelle question
const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', 0); // Pas de score ici
        return window.location.assign('./end-devinette.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} sur ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    currentQuestion = availableQuestions[0];  // La question en cours
    question.innerText = currentQuestion.question; // Afficher la question (devinette)
    question.dataset['answer'] = currentQuestion.answer; // Stocker la réponse cachée
    question.classList.remove('reveal-answer'); // Réinitialiser la classe pour masquer la réponse
    nextButton.style.display = 'none'; // Masquer le bouton suivant

    availableQuestions.splice(0, 1); // Supprimer la question utilisée
};

// Lorsque la question est cliquée, afficher la réponse
question.addEventListener('click', () => {
    question.innerText = currentQuestion.answer;
    question.classList.add('reveal-answer');
    nextButton.style.display = 'block'; // Afficher le bouton pour passer à la question suivante
});

// Lorsque l'utilisateur clique sur le bouton "Suivant"
nextButton.addEventListener('click', () => {
    getNewQuestion(); // Passer à la question suivante
});

// Démarrer le jeu
startGame();
