const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED = 0.05
const SPEED_SCALE_INCREASE = 0.00001
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100
const CACTUS_INTERVAL_MIN = 600
const CACTUS_INTERVAL_MAX = 2000

const worldElem = document.querySelector('[data-world]')
const groundElems = document.querySelectorAll('[data-ground]')
const dinoElem = document.querySelector('[data-dino]')
const startScreenElem = document.querySelector('[data-start-screen]')
const scoreElem = document.querySelector('[data-score]')
const alertElem = document.querySelector('[data-alert-container]')

if (localStorage.getItem('DinoMaxScore') === null)
	localStorage.setItem('DinoMaxScore', 0)

function getProperty(elem, prop) {
	return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}
function setProperty(elem, prop, value) {
	elem.style.setProperty(prop, value)
}
function incrementProperty(elem, prop, inc) {
	setProperty(elem, prop, getProperty(elem, prop) + inc)
}

//Ground
function setupGround() {
	setProperty(groundElems[0], '--left', 0)
	setProperty(groundElems[1], '--left', 300)
}
function updateGround(delta, speedScale) {
	groundElems.forEach(ground => {
		incrementProperty(ground, '--left', delta * speedScale * SPEED * -1)
		if (getProperty(ground, '--left') <= -300)
			incrementProperty(ground, '--left', 600)
	})
}

//Dino
let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
function setupDino() {
	isJumping = false
	dinoFrame = 0
	currentFrameTime = 0
	yVelocity = 0
	setProperty(dinoElem, '--bottom', 0)
	document.removeEventListener('keydown', onJump)
	document.addEventListener('keydown', onJump)
}
function updateDino(delta, speedScale) {
	if (isJumping) {
		dinoElem.src = 'imgs/dino-stationary.png'
		incrementProperty(dinoElem, '--bottom', yVelocity * delta)
		if (getProperty(dinoElem, '--bottom') <= 0) {
			setProperty(dinoElem, '--bottom', 0)
			isJumping = false
		}
		yVelocity -= GRAVITY * delta
	}
	else {
		if (currentFrameTime >= FRAME_TIME) {
			dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
			dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
			currentFrameTime -= FRAME_TIME
		}
		currentFrameTime += delta * speedScale
	}
}
function onJump(e) {
	if (e.code !== 'Space' || isJumping) return
	yVelocity = JUMP_SPEED
	isJumping = true
}

//Cactus
let nextCactusTime
let cactusElems = document.querySelectorAll('[data-cactus]')
function setupCactus() {
	nextCactusTime = CACTUS_INTERVAL_MIN
	cactusElems.forEach(cactus => cactus.remove())
}
function updateCactus(delta, speedScale) {
	cactusElems = document.querySelectorAll('[data-cactus]')
	cactusElems.forEach(cactus => {
		incrementProperty(cactus, '--left', delta * speedScale * SPEED * -1)
		if (getProperty(cactus, '--left') <= -100) {
			cactus.remove()
		}
	})

	if (nextCactusTime <= 0) {
		const cactus = document.createElement('img')
		cactus.dataset.cactus = true
		cactus.src = 'imgs/cactus.png'
		cactus.classList.add('cactus')
		setProperty(cactus, '--left', 100)
		worldElem.append(cactus)
		nextCactusTime = (Math.floor(Math.random() * (CACTUS_INTERVAL_MAX -
			CACTUS_INTERVAL_MIN + 1) + CACTUS_INTERVAL_MIN)) / speedScale
	}
	nextCactusTime -= delta
}

//Main
let lastTime
let speedScale
let score
function update(time) {
	if (lastTime == null) {
		lastTime = time
		requestAnimationFrame(update)
		return
	}
	const delta = time - lastTime

	updateGround(delta, speedScale)
	updateDino(delta, speedScale)
	updateCactus(delta, speedScale)
	speedScale += delta * SPEED_SCALE_INCREASE
	score += delta * 0.01 
	scoreElem.textContent = 'Score : '+Math.floor(score)

	if ((() => {	//Check Collision
		const dinoRect = dinoElem.getBoundingClientRect()
		return (() => {
			return Array.from(cactusElems).map(cactus => {
				return cactus.getBoundingClientRect()
			})
		})().some(rect => {
			return (
				rect.left < dinoRect.right &&
				rect.top < dinoRect.bottom &&
				rect.right > dinoRect.left &&
				rect.bottom > dinoRect.top
			)
		})
	})()) return handleOver()

	lastTime = time
	requestAnimationFrame(update)
}

function handleStart() {
	lastTime = null
	speedScale = 1
	score = 0
	setupGround()
	setupDino()
	setupCactus()
	startScreenElem.classList.add('hide')
	alertElem.innerHTML = ''
	requestAnimationFrame(update)
}
function handleOver() {
	dinoElem.src = 'imgs/dino-lose.png'; score = Math.floor(score)
	let high = localStorage.getItem('DinoMaxScore')
  	let message = '', code = localStorage.getItem('DinoCode')
	if(high < score) {
		localStorage.setItem('DinoMaxScore', score)
		if(code === null){
			if(score >= 250) {
				message += 'Your CodePeice : 4. '
				localStorage.setItem('DinoCode', '4')
			}
			else message += 'Try Again, Score 250 to get the code. '
		}
		message += 'New High Score : ' +score+ '.'
	}
	else
		message += 'You Scored : ' + score + '.'

	alertElem.innerHTML = '<div class="alert">' + message + '</div>'
	setTimeout(() => {
		document.addEventListener('keydown', handleStart, { once: true })
		startScreenElem.classList.remove('hide')
	}, 100)
}

function setPixelToWorldScale() {
	let worldToPixelScale =
	(innerWidth / innerHeight < WORLD_WIDTH / WORLD_HEIGHT)
		? innerWidth / WORLD_WIDTH
		: innerHeight / WORLD_HEIGHT

	worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
	worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}

setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener('keydown', handleStart, { once: true })