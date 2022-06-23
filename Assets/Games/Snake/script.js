const GRID_SIZE = 21
const SNAKE_SPEED = 5
const EXPANSION_RATE = 5
const gameBoard = document.getElementById('game-board')

if (localStorage.getItem('SnakeMaxScore') === null)
	localStorage.setItem('SnakeMaxScore', 0)

//Snake
let snakeBody, newSegments
function updateSnake() {
	for (let i = 0; i < newSegments; i++)
		snakeBody.push({ ...snakeBody[snakeBody.length - 1] })

	newSegments = 0
	const Direction = (() => {
		lastInputDirection = inputDirection
		return inputDirection
	})()
	for (let i = snakeBody.length - 2; i >= 0; i--)
		snakeBody[i + 1] = { ...snakeBody[i] }

	snakeBody[0].x += Direction.x
	snakeBody[0].y += Direction.y
}
function drawSnake() {
	snakeBody.forEach(segment => {
		const snakeElement = document.createElement('div')
		snakeElement.style.gridRowStart = segment.y
		snakeElement.style.gridColumnStart = segment.x
		snakeElement.classList.add('snake')
		gameBoard.appendChild(snakeElement)
	})
}
function onSnake(position, { ignoreHead = false } = {}) {
	return snakeBody.some((segment, index) => {
		if (ignoreHead && index === 0) return false
		return (segment.x === position.x && segment.y === position.y)
	})
}

//Food
let food
function updateFood() {
	if (onSnake(food)) {
		newSegments += EXPANSION_RATE
		food = getRandomFoodPosition()
	}
}
function drawFood() {
	const foodElement = document.createElement('div')
	foodElement.style.gridRowStart = food.y
	foodElement.style.gridColumnStart = food.x
	foodElement.classList.add('food')
	gameBoard.appendChild(foodElement)
}
function getRandomFoodPosition() {
	let newFoodPosition
	while (newFoodPosition == null || onSnake(newFoodPosition))
		newFoodPosition = (() => {
			return {
				x: Math.floor(Math.random() * GRID_SIZE) + 1,
				y: Math.floor(Math.random() * GRID_SIZE) + 1
			}
		})()
	return newFoodPosition
}

//Main
let inputDirection, lastInputDirection
function handleInput(e) {
	e.preventDefault()
	switch (e.key) {
		case 'ArrowUp':
			if (lastInputDirection.y !== 0) break
			inputDirection = { x: 0, y: -1 }
			break
		case 'ArrowDown':
			if (lastInputDirection.y !== 0) break
			inputDirection = { x: 0, y: 1 }
			break
		case 'ArrowLeft':
			if (lastInputDirection.x !== 0) break
			inputDirection = { x: -1, y: 0 }
			break
		case 'ArrowRight':
			if (lastInputDirection.x !== 0) break
			inputDirection = { x: 1, y: 0 }
			break
	}
}

let lastRenderTime, score, gameOver
function update() {
	updateSnake()
	updateFood()
	score = snakeBody.length - 1
	document.querySelector('[data-score]').textContent = 'Score : ' + score
	let position = snakeBody[0]
	gameOver = (
			position.x < 1 || position.x > GRID_SIZE ||
			position.y < 1 || position.y > GRID_SIZE
		) || onSnake(snakeBody[0], { ignoreHead: true })
}
function draw() {
	gameBoard.innerHTML = ''
	drawSnake(gameBoard)
	drawFood(gameBoard)
}
function showStat() {
	let high = localStorage.getItem('SnakeMaxScore')
	let message = '', code = localStorage.getItem('SnakeCode')
	if(high < score) {
		localStorage.setItem('SnakeMaxScore', score)
		if(code === null) {
			if(score >= 100) { 
				message += 'Your CodePeice : 5. '
				localStorage.setItem('SnakeCode', '5')
			}
			else message += 'Try Again, Score 100 to get the code. '
		}
		message += 'New High Score : ' +score+ '.'
	}
	else
		message += 'You Scored : ' + score + '.'	
	message += ' Reloading in 10 seconds.'

	const alert = document.createElement('div')
	alert.textContent = message
	alert.classList.add('alert')
	document.querySelector('[data-alert-container]').prepend(alert)

	;(new Promise(resolve => {
		setTimeout(() => {
			alert.classList.add('hide')
			alert.addEventListener('transitionend', alert.remove())
			return resolve()
		}, 10000)
	})).then(handleStart)
}
function main(currentTime) {
	if (gameOver) {
		showStat(); return
	}
	requestAnimationFrame(main)
	const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
	if (secondsSinceLastRender < 1 / SNAKE_SPEED) return
	lastRenderTime = currentTime
	update(); draw()
}

function handleStart() {
	lastRenderTime = 0
	score = 0
	gameOver = false
	newSegments = 0
	snakeBody = [{ x: 11, y: 11 }]
	inputDirection = { x: 0, y: 0 }
	lastInputDirection = { x: 0, y: 0 }
	food = getRandomFoodPosition()

	requestAnimationFrame(main)
	addEventListener('keydown', handleInput)
}
onload = handleStart