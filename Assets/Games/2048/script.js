const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

function createCellElements(gridElement) {
	const cells = []
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		const cell = document.createElement('div')
		cell.classList.add('cell')
		cells.push(cell)
		gridElement.append(cell)
	}
	return cells
}

class Grid {
	#cells
	constructor(gridElement) {
		gridElement.style.setProperty('--grid-size', GRID_SIZE)
		gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`)
		gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`)
		this.#cells = createCellElements(gridElement).map((cellElement, index) => {
			return new Cell(
				cellElement,
				index % GRID_SIZE,
				Math.floor(index / GRID_SIZE)
			)
		})
	}
	get cells() {
		return this.#cells
	}
	get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.y] = cellGrid[cell.y] || []
			cellGrid[cell.y][cell.x] = cell
			return cellGrid
		}, [])
	}
	get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.x] = cellGrid[cell.x] || []
			cellGrid[cell.x][cell.y] = cell
			return cellGrid
		}, [])
	}
	get #emptyCells() {
		return this.#cells.filter(cell => cell.tile == null)
	}
	randomEmptyCell() {
		const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
		return this.#emptyCells[randomIndex]
	}
}

class Cell {
	#cellElement
	#x
	#y
	#tile
	#mergeTile
	constructor(cellElement, x, y) {
		this.#cellElement = cellElement
		this.#x = x
		this.#y = y
	}
	get x() { return this.#x }
	get y() { return this.#y }
	get tile() { return this.#tile }
	get mergeTile() { return this.#mergeTile }

	set tile(value) {
		this.#tile = value
		if (value == null) return
		this.#tile.x = this.#x
		this.#tile.y = this.#y
	}
	set mergeTile(value) {
		this.#mergeTile = value
		if (value == null) return
		this.#mergeTile.x = this.#x
		this.#mergeTile.y = this.#y
	}

	canAccept(tile) {
		return (
			this.tile == null ||
			(this.mergeTile == null && this.tile.value === tile.value)
		)
	}
	mergeTiles() {
		if (this.tile == null || this.mergeTile == null) return
		this.tile.value = this.tile.value + this.mergeTile.value
		this.mergeTile.remove()
		this.mergeTile = null
		score += this.tile.value
	}
}

class Tile {
	#tileElement
	#x
	#y
	#value
	constructor(tileContainer, value = Math.random() > 0.05 ? 2 : 4) {
		this.#tileElement = document.createElement('div')
		this.#tileElement.classList.add('tile')
		tileContainer.append(this.#tileElement)
		this.value = value
	}
	get value() { return this.#value }

	set value(v) {
		this.#value = v
		this.#tileElement.textContent = v
		const power = Math.log2(v)
		const backgroundLightness = 100 - power * 9
		this.#tileElement.style.setProperty(
			'--background-lightness',
			`${backgroundLightness}%`
		)
		this.#tileElement.style.setProperty(
			'--text-lightness',
			`${backgroundLightness <= 50 ? 90 : 10}%`
		)
	}
	set x(value) {
		this.#x = value
		this.#tileElement.style.setProperty('--x', value)
	}
	set y(value) {
		this.#y = value
		this.#tileElement.style.setProperty('--y', value)
	}

	remove() { this.#tileElement.remove() }
	waitForTransition(animation = false) {
		return new Promise(resolve => {
			this.#tileElement.addEventListener(
				animation ? 'animationend' : 'transitionend',
				resolve, { once: true }
			)
		})
	}
}

//Main
const gameBoard = document.getElementById('game-board')
const scoreElem = document.querySelector('[data-score]')
if (localStorage.getItem('2048MaxScore') === null)
	localStorage.setItem('2048MaxScore', 0)

let grid, score
function handleStart() {
	gameBoard.innerHTML = ''; score = 0
	scoreElem.textContent = 'Score : ' + score
	grid = new Grid(gameBoard)
	grid.randomEmptyCell().tile = new Tile(gameBoard)
	grid.randomEmptyCell().tile = new Tile(gameBoard)
	setupInput()
}

function setupInput() {
  addEventListener('keydown', handleInput, { once: true })
}
function canMoveUp() {
	return canMove(grid.cellsByColumn)
}
function canMoveDown() {
	return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
	return canMove(grid.cellsByRow)
}
function canMoveRight() {
	return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}
function canMove(cells) {
	return cells.some(group => {
		return group.some((cell, index) => {
			if (index === 0 || cell.tile == null)
				return false

			const moveToCell = group[index - 1]
			return moveToCell.canAccept(cell.tile)
		})
	})
}
function slideTiles(cells) {
	return Promise.all(
		cells.flatMap(group => {
			const promises = []
			for (let i = 1; i < group.length; i++) {
				const cell = group[i]
				if (cell.tile == null)
					continue
				let lastValidCell
				for (let j = i - 1; j >= 0; j--) {
					const moveToCell = group[j]
					if (!moveToCell.canAccept(cell.tile))
						break
					lastValidCell = moveToCell
				}
				if (lastValidCell != null) {
					promises.push(cell.tile.waitForTransition())
					lastValidCell.tile != null
						? lastValidCell.mergeTile = cell.tile
						: lastValidCell.tile = cell.tile

					cell.tile = null
				}
			}
			return promises
		})
	)
}
async function handleInput(e) {
	e.preventDefault()
	switch (e.key) {
		case 'ArrowUp':
			if (!canMoveUp()) {
				setupInput()
				return
			}
			await slideTiles(grid.cellsByColumn)
			break
		case 'ArrowDown':
			if (!canMoveDown()) {
				setupInput()
				return
			}
			await slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
			break
		case 'ArrowLeft':
			if (!canMoveLeft()) {
				setupInput()
				return
			}
			await slideTiles(grid.cellsByRow)
			break
		case 'ArrowRight':
			if (!canMoveRight()) {
				setupInput()
				return
			}
			await slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
			break
		default:
			setupInput()
			return
	}
	grid.cells.forEach(cell => cell.mergeTiles())
	const newTile = new Tile(gameBoard)
	grid.randomEmptyCell().tile = newTile
	scoreElem.textContent = 'Score : ' + score

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(gameOver())
		return
	}
	setupInput()
}
function gameOver() {
	let high = localStorage.getItem('2048MaxScore')
	let message = '', code = localStorage.getItem('2048Code')
	if(high < score) {
		localStorage.setItem('2048MaxScore', score)
		if(code === null) {
			if(score >= 4000) {
				message += 'Your CodePeice : N. '
				localStorage.setItem('2048Code', 'N')
			}
			else
				message += 'Try Again, Score 4000 to get the code. '
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
onload = handleStart