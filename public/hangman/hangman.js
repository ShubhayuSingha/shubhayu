const words = [
    'telescope', 'bottle', 'liquid', 'fried rice', 'token', 'turtle', 'weapon',
    'kitten', 'selfish', 'shellfish', 'catfish', 'lobster', 'helicopter', 'aeroplane',
    'jaguar', 'operation', 'memory', 'power', 'bonfire', 'skull', 'accent',
    'aesthetic', 'joker', 'foolish', 'chicken', 'mythology'
];


let lives = 10;
let usedWords = []; // Array to store all used words
let selectedWord = ''; // Store the selected word globally
let availableWords = [];

// Function to select a random word, excluding words that have been used in the last game
function selectRandomWord() {
    availableWords = words.filter(word => !usedWords.includes(word));
    
    if (availableWords.length === 0) {
        showFeedbackMessage('No more words available.');  
        disableAllLetterButtons();        
        showHomeButtonOnly();
        return ''; // Early return if no words are available
    }
    
    let randomIndex = Math.floor(Math.random() * availableWords.length);
    selectedWord = availableWords[randomIndex];
    usedWords.push(selectedWord);
    return selectedWord.toUpperCase();
}

// Initialize the game state
function initializeGame() {
    // Clear and regenerate letter buttons
    letterButtonsContainer.innerHTML = ''; 
    resetLife();   
    generateLetterButtons();
    hideEndGameButtons();

    // Enable all letter buttons
    letterButtonsContainer.querySelectorAll('button').forEach(button => {
        button.disabled = false; // Ensure all buttons are enabled
    });
    
    selectedWord = selectRandomWord();
    guessedLetters = [];
    incorrectLetters = [];
    
    // Initialize displayWord with underscores for letters and spaces for spaces
    displayWord = selectedWord.split('').map(letter => letter === ' ' ? ' ' : '_');

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
let displayWord = selectRandomWord().split('').map(letter => letter === ' ' ? ' ' : '_');

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

function showFeedbackMessage(message) {
    // Apply blink effect
    feedback.classList.add('blink');

    // Wait for the animation to complete before updating the text content
    setTimeout(() => {
        feedback.textContent = message;
        // Remove the blink effect class after updating the text
        feedback.classList.remove('blink');
    }, 500); // Duration should match the CSS animation duration
}

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

function resetLife(){
    lives = 10;
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
                showFeedbackMessage('Keep going!');
                updateWordDisplay();
                sameLife();

                if (!displayWord.includes('_')) {
                    showFeedbackMessage('Congratulations! You guessed the word!');
                    disableAllLetterButtons();
                    showEndGameButtons();
                }
            } else {
                showFeedbackMessage('Wrong guess.');
                incorrectLetters.push(letter);
                updateWordDisplay();
                reduceLife();
            }
        } else {
            showFeedbackMessage('Repeating letters.');
            updateWordDisplay();
            sameLife();
        }
    }  
    if (lives === 0) {
        livesDisplay.textContent = "Lives: " + 0;
        showFeedbackMessage('Unlucky... You lost the game. The word was: ' + selectedWord);
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
// Generate letter buttons in rows
function generateLetterButtons() {
    const letterRows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM'
    ];

    letterRows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.onclick = () => handleGuess(letter, button);
            button.id = `id-${letter}`; // Set an id for each button
            rowDiv.appendChild(button);
        });
        letterButtonsContainer.appendChild(rowDiv);
    });
}


// Function to show end game buttons
function showEndGameButtons() {
    newGameContainer.style.display = 'flex';
}

function showHomeButtonOnly() {
    newGameContainer.style.display = 'flex';
    newGameButton.style.display = 'none'; // Hide the new game button
}

function hideEndGameButtons() {
    newGameContainer.style.display = 'none';
}

// Event listener for new game button
newGameButton.addEventListener('click', initializeGame);

// Event listener for home button
homeButton.addEventListener('click', () => window.location.href = '/'); // Replace '/' with the URL of your homepage

// Add event listener for key presses
document.addEventListener('keydown', (event) => {
    const letter = event.key.toUpperCase();
    const buttonId = `id-${letter}`;
    const button = document.getElementById(buttonId);
    if (button && !button.disabled) {
        button.click(); // Simulate a click on the button
    }
});

initializeGame();
