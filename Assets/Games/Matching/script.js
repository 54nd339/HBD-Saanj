class AudioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/flip.wav')
        this.matchSound = new Audio('Assets/Audio/match.wav')
        this.victorySound = new Audio('Assets/Audio/victory.wav')
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav')
    }

    flip() { this.flipSound.play() }
    match() { this.matchSound.play() }
    victory() { this.victorySound.play() }
    gameOver() { this.gameOverSound.play() }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards
        this.totalTime = totalTime
        this.timeRemaining = totalTime
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips')
        this.audioController = new AudioController()
    }

    startGame() {
        this.totalClicks = 0
        this.timeRemaining = this.totalTime
        this.cardToCheck = null
        this.matchedCards = []
        this.busy = true
        setTimeout(() => {
            this.busy = false
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
        }, 500)
    
        this.cardsArray.forEach(card => card.classList.remove(...['visible','matched']))
        this.timer.innerText = this.timeRemaining
        this.ticker.innerText = this.totalClicks
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) {
                this.gameOver();
                alert('Time ran out :(');
            }
            if(this.totalClicks > 30){
                this.gameOver();
                alert('More than 30 clicks :(');
            }
        }, 1000);
    }
    flipCard(card) {
        if(!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck) {
            this.audioController.flip()
            this.totalClicks++
            this.ticker.innerText = this.totalClicks
            card.classList.add('visible')

            this.cardToCheck ? this.checkForCardMatch(card)
                             : this.cardToCheck = card
        }
    }
    
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck)
        else 
            this.cardMismatch(card, this.cardToCheck)
        this.cardToCheck = null
        if(this.totalClicks === 30)
            this.gameOver('30 clicks clicked :(')
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1)
        this.matchedCards.push(card2)
        card1.classList.add('matched')
        card2.classList.add('matched')
        this.audioController.match()
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory() 
    }
    cardMismatch(card1, card2) {
        this.busy = true
        setTimeout(() => {
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false
        }, 1000)
    }
    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    victory() {
        clearInterval(this.countdown)
        this.audioController.victory()
        let message='', code = localStorage.getItem('MixCode')
        if(code === null) {
            localStorage.setItem('MixCode', 'A')
            message = 'Your CodePeice : A'
        }
        this.showStat(true, message)
    }
    gameOver(message) {
        clearInterval(this.countdown)
        this.audioController.gameOver()
        this.showStat(false, message)
    }
    showStat(flag, message) {
        let html
        if(flag) {
            html = document.getElementById('victory-text')
            html.classList.add('visible')
        }
        else {
            html = document.getElementById('game-over-text')
            html.classList.add('visible')
        }
        html.innerHTML += '<span id="msg" class="overlay-text-small">' + message + '</span>'
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'))
    let cards = Array.from(document.getElementsByClassName('card'))
    let game = new MixOrMatch(60, cards)
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible')
            game.startGame()
        })
    })
    cards.forEach(card => card.addEventListener('click', () => game.flipCard(card)))
}
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready()