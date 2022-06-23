import dictionary from './dictionary.json' assert { type: "json" }
import targetWords from './targetWords.json' assert { type: "json" }

const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500

const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const targetWord = targetWords[Math.floor((Math.random() * targetWords.length) + 1)]
let guessno = 0

function startInteraction() {
	document.addEventListener("click", handleMouseClick)
	document.addEventListener("keydown", handleKeyPress)
}
function stopInteraction() {
	document.removeEventListener("click", handleMouseClick)
	document.removeEventListener("keydown", handleKeyPress)
}
function getActiveTiles() {
	return guessGrid.querySelectorAll('[data-state="active"]')
}

function handleMouseClick(e) {
	if (e.target.matches("[data-key]")) {
		pressKey(e.target.dataset.key)
		return
	}
	if (e.target.matches("[data-enter]")) {
		submitGuess()
		return
	}
	if (e.target.matches("[data-delete]")) {
		deleteKey()
		return
	}
}
function handleKeyPress(e) {
	if (e.key === "Enter") {
		submitGuess()
		return
	}
	if (e.key === "Backspace" || e.key === "Delete") {
		deleteKey()
		return
	}
	if (e.key.match(/^[a-z]$/)) {
		pressKey(e.key)
		return
	}
}

function pressKey(key) {
	const activeTiles = getActiveTiles()
	if (activeTiles.length >= WORD_LENGTH) return
	const nextTile = guessGrid.querySelector(":not([data-letter])")
	nextTile.dataset.letter = key.toLowerCase()
	nextTile.textContent = key
	nextTile.dataset.state = "active"
}
function deleteKey() {
	const activeTiles = getActiveTiles()
	const lastTile = activeTiles[activeTiles.length - 1]
	if (lastTile == null) return
	lastTile.textContent = ""
	delete lastTile.dataset.state
	delete lastTile.dataset.letter
}
function submitGuess() {
	const activeTiles = [...getActiveTiles()]
	if (activeTiles.length !== WORD_LENGTH) {
		showAlert("Not enough letters")
		shakeTiles(activeTiles)
		return
	}
	const guess = activeTiles.reduce((word, tile) => {
		return word + tile.dataset.letter
	}, "")
	if (!dictionary.includes(guess)) {
		showAlert("Not in word list")
		shakeTiles(activeTiles)
		return
	}
	stopInteraction()
	activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
	const letter = tile.dataset.letter
	const key = keyboard.querySelector(`[data-key="${letter}"i]`)
	setTimeout(() => tile.classList.add("flip"),
		(index * FLIP_ANIMATION_DURATION) / 2)

	tile.addEventListener(
		"transitionend", () => {
			tile.classList.remove("flip")
			if (targetWord[index] === letter) {
				tile.dataset.state = "correct"
				key.classList.add("correct")
			} else if (targetWord.includes(letter)) {
				tile.dataset.state = "wrong-location"
				key.classList.add("wrong-location")
			} else {
				tile.dataset.state = "wrong"
				key.classList.add("wrong")
			}
			if (index === array.length - 1) {
				tile.addEventListener(
					"transitionend", () => {
						startInteraction()
						checkWinLose(guess, array)
					}, { once: true }
				)}
		}, { once: true }
	)
}
function shakeTiles(tiles) {
	tiles.forEach(tile => {
		tile.classList.add("shake")
		tile.addEventListener(
			"animationend",
			() => tile.classList.remove("shake"),
			{ once: true }
		)
	})
}
function danceTiles(tiles) {
	tiles.forEach((tile, index) => {
		setTimeout(() => {
			tile.classList.add("dance")
			tile.addEventListener(
				"animationend",
				() => tile.classList.remove("dance"),
				{ once: true }
			)},
		(index * DANCE_ANIMATION_DURATION) / 5)
	})
}

function showAlert(message, duration = 1000) {
	const alert = document.createElement("div")
	alert.textContent = message
	alert.classList.add("alert")
	alertContainer.prepend(alert)
	if (duration == null) return

	setTimeout(() => {
		alert.classList.add("hide")
		alert.addEventListener("transitionend", () => alert.remove())
	}, duration)
}
function checkWinLose(guess, tiles) {
	if (guess === targetWord) {
		danceTiles(tiles)
		setTimeout(() => {
			let code = localStorage.getItem('WordCode')
			if(code === null) {
				localStorage.setItem('WordCode', 'J')
				message = 'Your CodePeice : J. '
			}
			message = 'You Win. '
			if(confirm(message))
				location.reload()
		}, 1000)
		return
	}
	if(guessno >= 5) {
		if (confirm('Damn, Your Arrogance.'))
			location.reload()
		return
	}
	const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
	if (remainingTiles.length === 0) {
		showAlert("Hint : character at "+(guessno+1)+" - "+targetWord.toUpperCase()[guessno++]+". Try Again.", 5000)
		setTimeout(() => {
			let x = document.getElementsByClassName('tile')
			for (let i = 0; i < x.length; i++) {
				x[i].removeAttribute('data-letter')
				x[i].removeAttribute('data-state')
				x[i].innerHTML = ''
			}
			startInteraction()
		}, 2000)
	}
}
startInteraction()