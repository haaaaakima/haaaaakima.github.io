const question = document.querySelector('#question');
const nextButton = document.querySelector('#nextButton');

let currentQuestion = {};
let acceptingAnswers = true;
let availableQuestions = [];  // Liste de questions récupérées

// Fonction pour récupérer des devinettes depuis l'API JokeAPI
const fetchQuestionsFromAPI = async () => {
    try {
        // Nous récupérons ici un set de devinettes, sans limite spécifique.
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
            }).filter(Boolean);  // Filtrer les résultats non valides
        } else {
            console.log("Aucune devinette valide");
            return [];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des devinettes:", error);
        return [];
    }
};

// Afficher la prochaine question
const showNextQuestion = async () => {
    acceptingAnswers = true;
    nextButton.style.display = "none";  // Masquer le bouton "Suivant" jusqu'à ce que la réponse soit révélée

    // Si nous n'avons plus de questions disponibles, on en récupère de nouvelles
    if (availableQuestions.length === 0) {
        availableQuestions = await fetchQuestionsFromAPI();
    }

    // Sélectionner la première question de la liste disponible
    currentQuestion = availableQuestions.shift(); // Retirer la question de la liste

    // Mettre à jour le texte de la question
    question.innerText = currentQuestion.question;
    
    // Réinitialiser l'état de la question pour l'affichage
    question.classList.remove('reveal-answer');
    question.style.cursor = "pointer";  // Cursor indiquant qu'il faut cliquer pour voir la réponse
};

// Afficher la réponse lorsque l'utilisateur clique sur la question
question.addEventListener('click', () => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    question.innerText = currentQuestion.answer;  // Afficher la réponse à la devinette
    question.classList.add('reveal-answer');  // Ajouter une classe pour révéler la réponse
    nextButton.style.display = "block";  // Afficher le bouton "Suivant"
    question.style.cursor = "default";  // Modifier le curseur pour signaler que la question n'est plus cliquable
});

// Passer à la devinette suivante en cliquant sur le bouton
nextButton.addEventListener('click', async () => {
    await showNextQuestion();  // Charger la prochaine devinette
});

// Démarrer le jeu en récupérant les premières devinettes
const startGame = async () => {
    availableQuestions = await fetchQuestionsFromAPI();  // Charger un premier jeu de questions
    if (availableQuestions.length > 0) {
        showNextQuestion();  // Afficher la première question
    } else {
        alert("Pas de devinettes disponibles, essayez plus tard.");
    }
};

startGame();  // Lancer le jeu au chargement de la page
