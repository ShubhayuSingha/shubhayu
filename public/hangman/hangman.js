const words = [
    'telescope', 'bottle', 'liquid', 'fried-rice', 'token', 'turtle', 'weapon',
    'kitten', 'selfish', 'shellfish', 'catfish', 'lobster', 'helicopter', 'aeroplane',
    'jaguar', 'operation', 'memory', 'power', 'bonfire', 'skull', 'accent',
    'aesthetic', 'joker', 'foolish', 'chicken', 'mythology'
];


let lives = 10;
let usedWords = []; // Array to store all used words
let selectedWord = ''; // Store the selected word globally

// Function to select a random word, excluding words that have been used in the last game
function selectRandomWord() {
    let availableWords = words.filter(word => !usedWords.includes(word));

    if (availableWords.length === 0) {
        usedWords = [];
        availableWords = words.slice(); // Reset to include all words
    }

    let randomIndex = Math.floor(Math.random() * availableWords.length);
    let selectedWord = availableWords[randomIndex];

    usedWords.push(selectedWord);

    return selectedWord.toUpperCase();
}

// Initialize the game state
function initializeGame() {
    // Clear and regenerate letter buttons
    letterButtonsContainer.innerHTML = '';
    generateLetterButtons();
    hideEndGameButtons();

    // Enable all letter buttons
    letterButtonsContainer.querySelectorAll('button').forEach(button => {
        button.disabled = false; // Ensure all buttons are enabled
    });
    
    selectedWord = selectRandomWord();
    guessedLetters = [];
    incorrectLetters = [];
    lives = 10;
    displayWord = selectedWord.split('').map(letter => '_');

    wordDisplay.textContent = displayWord.join(' ');
    livesDisplay.textContent = "Lives: " + lives;
    feedback.textContent = 'Let us start the game.';
    guessedLettersContainer.textContent = '';

    

    // Hide new game buttons container
    newGameContainer.style.display = 'none';
}

// Array to store guessed letters
let guessedLetters = [];
let incorrectLetters = [];

// Display dashes for each letter in the word
let displayWord = selectRandomWord().split('').map(letter => '_');

// DOM elements
const wordDisplay = document.getElementById('word-display');
const letterButtonsContainer = document.getElementById('letter-buttons'); // Container for letter buttons
const feedback = document.getElementById('feedback');
const guessedLettersContainer = document.getElementById('guessed-letters');
const livesDisplay = document.getElementById('lives-display');
const newGameContainer = document.getElementById('new-game-container'); // Container for new game buttons
const newGameButton = document.getElementById('new-game-button'); // New game button
const homeButton = document.getElementById('home-button'); // Home button

// Display initial word state
wordDisplay.textContent = displayWord.join(' ');
livesDisplay.textContent = "Lives: " + lives;

function updateWordDisplay() {
    wordDisplay.textContent = displayWord.join(' ');
}

function reduceLife() {
    lives--;
    livesDisplay.textContent = "Lives: " + lives;
}

function sameLife() {
    livesDisplay.textContent = "Lives: " + lives;
}

// Function to handle a guess
function handleGuess(letter, button) {
    letter = letter.toUpperCase();
    if (lives >= 0) {
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);

            // Disable the button
            button.disabled = true;

            if (selectedWord.includes(letter)) {
                for (let i = 0; i < selectedWord.length; i++) {
                    if (selectedWord[i] === letter) {
                        displayWord[i] = letter;
                    }
                }
                feedback.textContent = 'Keep going!';
                updateWordDisplay();
                sameLife();

                if (!displayWord.includes('_')) {
                    feedback.textContent = 'Congratulations! You guessed the word!';
                    disableAllLetterButtons();
                    showEndGameButtons();
                }
            } else {
                feedback.textContent = 'Wrong guess.';
                incorrectLetters.push(letter);
                updateWordDisplay();
                reduceLife();
            }
        } else {
            feedback.textContent = 'Repeating letters.';
            updateWordDisplay();
            sameLife();
        }
    }  if (lives === 0) {
        livesDisplay.textContent = "Lives: " + 0;
        feedback.textContent = 'Unlucky... You lost the game. The word was: ' + selectedWord;
        showEndGameButtons();
        disableAllLetterButtons();
    }
}
function disableAllLetterButtons() {
    letterButtonsContainer.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });
}

// Generate letter buttons
function generateLetterButtons() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    letters.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => handleGuess(letter, button);
        letterButtonsContainer.appendChild(button);
    });
}

// Function to show end game buttons
function showEndGameButtons() {
    newGameContainer.style.display = 'flex';
}
function hideEndGameButtons(){
    newGameContainer.style.display = 'none'
}

// Event listener for new game button
newGameButton.addEventListener('click', initializeGame);

// Event listener for home button
homeButton.addEventListener('click', () => window.location.href = '/'); // Replace '/' with the URL of your homepage

// Initialize the game

initializeGame();
