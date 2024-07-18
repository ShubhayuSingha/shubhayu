const words = [
    'telescope', 'bottle', 'liquid', 'fried-rice', 'token', 'turtle', 'weapon',
    'kitten', 'selfish', 'shellfish', 'catfish', 'lobster', 'helicopter', 'aeroplane',
    'jaguar', 'operation', 'memory', 'power', 'bonfire', 'skull', 'accent',
    'aesthetic', 'joker', 'foolish', 'chicken', 'mythology'
];

let lives = 10;
let usedWords = []; // Array to store all used words

// Function to select a random word, excluding words that have been used in the last game
function selectRandomWord() {
    // Filter out words that have been used in the last game
    let availableWords = words.filter(word => !usedWords.includes(word));

    // If all words have been used, reset usedWords to empty array
    if (availableWords.length === 0) {
        usedWords = [];
        availableWords = words.slice(); // Reset to include all words
    }

    // Select a random word from availableWords
    let randomIndex = Math.floor(Math.random() * availableWords.length);
    let selectedWord = availableWords[randomIndex];

    // Add selected word to usedWords
    usedWords.push(selectedWord);

    // Return selected word in uppercase
    return selectedWord.toUpperCase();
}

let selectedWord = selectRandomWord();

// Array to store guessed letters
let guessedLetters = [];
let incorrectLetters = [];

// Display dashes for each letter in the word
let displayWord = selectedWord.split('').map(letter => '_');

// DOM elements
const wordDisplay = document.getElementById('word-display');
const guessInput = document.getElementById('guess');
const guessButton = document.getElementById('guess-button');
const feedback = document.getElementById('feedback');
const guessedLettersContainer = document.getElementById('guessed-letters');
const livesDisplay = document.getElementById('lives-display');

// Display initial word state
wordDisplay.textContent = displayWord.join(' ');
livesDisplay.textContent = "Lives: "+lives;

// Function to update word display
function updateWordDisplay() {
    wordDisplay.textContent = displayWord.join(' ');    
    incorrectLetters.sort();
    guessedLettersContainer.textContent = incorrectLetters.join(' ');
}

function reduceLife(){
    lives--;
    livesDisplay.textContent = "Lives: "+lives;    
}
function sameLife(){
    livesDisplay.textContent = "Lives: "+lives;
}

// Function to handle a guess
function handleGuess() {
    let guess = guessInput.value.toUpperCase();
    guessInput.value = '';
    if (lives>1){
    // Check if the guessed letter is valid and hasn't been guessed already
        if (guess.match(/[A-Z]/) && guessedLetters.indexOf(guess) === -1) {
            guessedLetters.push(guess);

            // Check if the guessed letter is in the word
            if (selectedWord.includes(guess)) {
                // Update displayWord with the guessed letter(s)
                for (let i = 0; i < selectedWord.length; i++) {
                    if (selectedWord[i] === guess) {
                        displayWord[i] = guess;
                    }
                }
                feedback.textContent = 'Keep going!'
                updateWordDisplay();
                sameLife();

                // Check if the word has been completely guessed
                if (!displayWord.includes('_')) {
                    feedback.textContent = 'Congratulations! You guessed the word!';
                    guessButton.textContent = 'NEW GAME';
                    guessButton.onclick = function(){
                        location.reload();
                    }
                }
            } else {
                // Incorrect guess
                feedback.textContent = 'Wrong guess.';
                incorrectLetters.push(guess);
                updateWordDisplay();
                reduceLife();              
            }
        } else {
            // Invalid guess (non-alphabetical or already guessed)
            feedback.textContent = 'Repeating letters.';
            updateWordDisplay();
            sameLife();
        }
    } else{
        livesDisplay.textContent = "Lives: "+0;
        feedback.textContent = 'Unlucky... You lost the game. The word was: \n'+selectedWord;        
        guessButton.textContent = 'NEW GAME';
        guessButton.onclick = function(){
            location.reload();
        }
    }
}

// Event listener for guess button click
guessButton.addEventListener('click', handleGuess);

// Event listener for Enter key press in guess input
guessInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
