const gameState = Object.freeze({ IDLE: 0, PLAYING: 1 })
const guessOutcome = Object.freeze({ GOOD_GUESS: 0, BAD_GUESS: 1, ALREADY_GUESSED: 2, })

class Pendu {
    constructor() {
        this.state = gameState.IDLE;
        this.answer = "";
        this.guessedLetters = [];
        this.lifesLeft = 10;
        this.found = false;

    }

    init(word) {
        this.state = gameState.PLAYING;
        this.answer = word.toUpperCase();
        this.guessedLetters = [];
        this.lifesLeft = 10;
        this.guessedLetters.push("-")
        this.found = false;
    }

    mask() {
        return this.answer.split('').map(letter => {
            return this.guessedLetters.includes(letter) ? letter : "*"
        }).join(" ")
    }

    newGuess(letter) {
        letter = letter.toUpperCase();
        if (this.guessedLetters.includes(letter)) {
            this.lifesLeft--;
            return guessOutcome.ALREADY_GUESSED;
        } else {
            this.guessedLetters.push(letter)
            if (this.answer.includes(letter)) {
                return guessOutcome.GOOD_GUESS;
            } else {
                this.lifesLeft--;
                return guessOutcome.BAD_GUESS;
            }
        }
    }

    guessWord(word) {
        console.log("Guessed word", word)
        console.log("Answer", this.answer)
        if (this.answer.toUpperCase() == word.toUpperCase()) {
            this.found = true;
            return guessOutcome.GOOD_GUESS;
        } else {
            this.lifesLeft -= 2;
            return guessOutcome.BAD_GUESS;
        }
    }

    gameWon() {
        return !this.mask().split("").includes("*") || this.found
    }

    gameDone() {
        console.log(this.lifesLeft)
        return this.gameWon() || this.lifesLeft <= 0
    }
}

module.exports = {
    Pendu,
    guessOutcome,
    gameState
}