const question = document.querySelector('#question');
const nextButton = document.querySelector('#nextButton');

let currentQuestion = {};
let acceptingAnswers = true;
let availableQuestions = [];

// Fonction pour récupérer des devinettes depuis l'API JokeAPI
const fetchQuestionsFromAPI = async () => {
    try {
        // Nous récupérons ici 5 devinettes
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?lang=fr&type=twopart&format=json&amount=5');
        const data = await response.json();

        if (data && data.jokes) {
            return data.jokes.map(joke => {
                if (joke.type === 'twopart') {
                    return {
                        question: joke.setup,  // La question de la devinette
                        answer: joke.delivery, // La réponse correcte
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

// Afficher la nouvelle question
const showNextQuestion = () => {
    acceptingAnswers = true;
    nextButton.style.display = "none"; // Masquer le bouton "Suivant" jusqu'à ce que la réponse soit révélée

    // Vérifier s'il reste des questions, sinon en récupérer de nouvelles
    if (availableQuestions.length === 0) {
        availableQuestions = fetchQuestionsFromAPI();
    }

    // Prendre la première question disponible
    currentQuestion = availableQuestions.shift(); // Retirer la question utilisée

    question.innerText = currentQuestion.question;  // Afficher la question

    // Réinitialiser le style pour afficher la question sans la réponse visible
    question.classList.remove('reveal-answer');
    question.style.cursor = "pointer";  // Changer le curseur en pointer pour inviter à cliquer
};

// Afficher la réponse lorsqu'on clique sur la question
question.addEventListener('click', () => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    question.innerText = currentQuestion.answer;  // Afficher la réponse
    question.classList.add('reveal-answer');  // Changer le style pour indiquer que la réponse est révélée
    nextButton.style.display = "block";  // Afficher le bouton "Suivant"
    question.style.cursor = "default";  // Changer le curseur pour indiquer que la question n'est plus cliquable
});

// Passer à la devinette suivante en cliquant sur le bouton
nextButton.addEventListener('click', () => {
    showNextQuestion();  // Charger la prochaine devinette
});

// Lancer le jeu en récupérant la première série de devinettes
const startGame = async () => {
    availableQuestions = await fetchQuestionsFromAPI();  // Récupérer les devinettes depuis l'API
    if (availableQuestions.length > 0) {
        showNextQuestion();  // Afficher la première question
    } else {
        alert("Pas de devinettes disponibles, essayez plus tard.");
    }
};

startGame();  // Lancer le jeu au chargement de la page
