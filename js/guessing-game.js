function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1
}

function shuffle(arr) {
    let lastIndx = arr.length,
        randomIndx, placeholder;

    while (lastIndx) {
        randomIndx = Math.floor(Math.random() * lastIndx);

        lastIndx--;
        placeholder = arr[lastIndx];
        arr[lastIndx] = arr[randomIndx];
        arr[randomIndx] = placeholder;
    }

    return arr
}

class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }

    difference() {
        return Math.abs(this.winningNumber - this.playersGuess);
    }

    isLower() {
        return this.playersGuess < this.winningNumber;
    }

    playersGuessSubmission(num) {
        if (num < 1 || num > 100 || typeof num !== 'number') throw 'That is an invalid guess.';
        this.playersGuess = num;
        return this.checkGuess();
    }

    checkGuess() {
        let remainingGuesses = 5 - this.pastGuesses.length;

        if (this.playersGuess === this.winningNumber) return 'You Win!';
        else if (this.pastGuesses.includes(this.playersGuess)) return 'You have already guessed that number.'
        else {
            this.pastGuesses.push(this.playersGuess);
            remainingGuesses = remainingGuesses - 1;
            if (!remainingGuesses) return 'You Lose.';
            else if (this.difference() < 10) return 'You\'re burning up!';
            else if (this.difference() < 25) return 'You\'re lukewarm.';
            else if (this.difference() < 50) return 'You\'re a bit chilly.';
            return 'You\'re ice cold!';
        }
    }

    provideHint() {
        const arrOfHints = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

        return shuffle(arrOfHints);
    }
}

const newGame = () => new Game();


// Global variables/shortcuts
const textField = document.querySelector('h2');
const submitBtn = document.querySelector('.submit-btn');
const inputField = document.querySelector('.num-field>input');
const previousGuesses = document.querySelectorAll('li');
const hintBtn = document.querySelector('.hint-btn');
const restartBtn = document.querySelector('.restart-btn');
let gameInProgress = false;
let hintCount = 1;

// Event Listeners
inputField.addEventListener('keydown', startGameWithPress);
submitBtn.addEventListener('click', startGame);
hintBtn.addEventListener('click', hintProvider);
restartBtn.addEventListener('click', gameReset);

function startGameWithPress(event) {
    if (event.which === 13) submitBtn.click();
}

function startGame() {
    if (parseInt(inputField.value) >= 1 && parseInt(inputField.value) <= 100) {
        if (!gameInProgress) gameInProgress = newGame();
        const num = parseInt(inputField.value);
        inputField.value = '';
        textField.innerHTML = gameInProgress.playersGuessSubmission(num);
        previousGuessesNodeList(num);
        if (textField.innerHTML === 'You Lose.') disableElements();
        else if (textField.innerHTML === 'You Win!') disableElements();
    } else textField.innerHTML = 'Enter a valid number between 1 - 100';
}

function previousGuessesNodeList(num) {
    const indx = gameInProgress.pastGuesses.length - 1;

    previousGuesses[indx].innerHTML = num;
}

function hintProvider() {
    if (!gameInProgress) textField.innerHTML = 'Initiate the game to receive a hint'
    else if (gameInProgress.pastGuesses.length >= 3 && hintCount) {
        textField.innerHTML = `Hint: [${gameInProgress.provideHint().reduce((accum, next, indx , arr) =>  accum += ` ${next},`, '').trim().slice(0, -1)}]`
        hintCount--;
        hintBtn.innerHTML = `Hint (${hintCount})`;
    } else if (gameInProgress.pastGuesses.length < 3) textField.innerHTML = `${3 - gameInProgress.pastGuesses.length} more guess(es) must first be made`;
}

function gameReset() {
    gameInProgress = new Game();
    textField.innerHTML = 'Guess a number between 1 - 100';
    previousGuesses.forEach(element => element.innerHTML = '-');
    hintCount = 1;
    hintBtn.innerHTML = `Hint (${hintCount})`;
    enableElements();
}

function disableElements() {
    inputField.setAttribute('disabled', true);
    submitBtn.setAttribute('disabled', true);
    hintBtn.setAttribute('disabled', true);
}

function enableElements() {
    inputField.removeAttribute('disabled');
    submitBtn.removeAttribute('disabled');
    hintBtn.removeAttribute('disabled');
}