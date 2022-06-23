import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, snakeBody, onSnake } from './Snake.js'
import { update as updateFood, draw as drawFood } from './Food.js'
import { outsideGrid } from './Grid.js'

const gameBoard = document.getElementById('game-board')
const scoreElem = document.querySelector("[data-score]")
let lastRenderTime = 0
let score = 0
let gameOver = false

function checkDeath() {
	gameOver = outsideGrid(snakeBody[0])
		|| onSnake(snakeBody[0], { ignoreHead: true })
}
function update() {
	updateSnake()
	updateFood()
	score = snakeBody.length - 1
	scoreElem.textContent = "Score : " + score
	checkDeath()
}
function draw() {
	gameBoard.innerHTML = ''
	drawSnake(gameBoard)
	drawFood(gameBoard)
}
function main(currentTime) {
	if (gameOver) {
		let s = (score >= 100)
				? 'Here is your code : 5.'
				: 'Game Over, score 100 to get the code.'
		if(confirm(s))
			window.location.reload()
		return
	}
	requestAnimationFrame(main)
	const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
	if (secondsSinceLastRender < 1 / SNAKE_SPEED) return
	lastRenderTime = currentTime
	update(); draw()
}

requestAnimationFrame(main)