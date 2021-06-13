/*
	Implementation does not deal with significantly large numbers nor negative numbers in file input -- will
	discuss implementation with such numbers during interview.
*/

let grid;
let cols, rows;
const cellSize = 10;
let numGenerations = -99;
const liveCells = [];

// p5.js initialize.
function setup() {
	createCanvas(1200, 800);

	cols = width / cellSize;
	rows = height / cellSize;

	grid = new Array();
	randomizeGrid(grid);
}

// p5.js update loop.
function draw() {
	background(0);
	if (numGenerations > 0 || numGenerations <= -99) {
		next = JSON.parse(JSON.stringify(grid));

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const cell = grid[i * rows + j];

				// Ignore dead cells with zero neighbors.
				if (!cell.isAlive && cell.liveNeighbors == 0) continue;

				if (!cell.isAlive && cell.liveNeighbors == 3) {
					const c = setCell(next, next[i * rows + j]);

					if (numGenerations == 1) {
						liveCells.push(c);
					}
				} else if (cell.isAlive && (cell.liveNeighbors < 2 || cell.liveNeighbors > 3)) {
					clearCell(next, next[i * rows + j]);
				} else {
					if (numGenerations == 1 && cell.isAlive) {
						liveCells.push(next[i * rows + j]);
					}
				}
			}
		}

		grid = next;
		numGenerations--;

		if (numGenerations == 0) {
			console.log('#Life 1.06');
			liveCells.forEach(cell => console.log(`${cell.x} ${cell.y}`));
			liveCells.length = 0;
		}
	}

	renderGrid(grid);
}

//#region Helper methods for Game of Life.
function randomizeGrid(grid) {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid.push(new Cell(i, j, Math.random() < 0.5, 0));
		}
	}

	for (let i = 0; i < grid.length; i++) {
		const cell = grid[i];
		cell.liveNeighbors = countLiveNeighbors(grid, cell);
	}
}

function clearGrid(grid) {
	grid.forEach(cell => {
		cell.isAlive = false;
		cell.liveNeighbors = 0;
	});
}

function setCell(grid, cell) {
	cell.isAlive = true;
	updateNeighbors(grid, cell);
	return cell;
}

function clearCell(grid, cell) {
	cell.isAlive = false;
	updateNeighbors(grid, cell);
	return cell;
}

function countLiveNeighbors(grid, cell) {
	let sum = 0;

	const neighborCells = getNeighborCells(grid, cell);
	neighborCells.forEach(neighborCell => {
		if (neighborCell.isAlive) sum++;
	});

	return sum;
}

function updateNeighbors(grid, cell) {
	const neighborCells = getNeighborCells(grid, cell);
	neighborCells.forEach(neighborCell => {
		neighborCell.liveNeighbors = neighborCell.liveNeighbors + (cell.isAlive ? 1 : -1);
	});
}

function getNeighborCells(grid, cell) {
	const x = cell.x;
	const y = cell.y;

	const lookLeft = (x == 0 ? cols - 1 : x - 1);
	const lookRight = (x == cols - 1 ? 0 : x + 1);
	const lookUp = (y == 0 ? rows - 1 : y - 1);
	const lookDown = (y == rows - 1 ? 0 : y + 1);

	const neighborCells = [];
	neighborCells.push(grid[(rows) * lookLeft + lookUp]); // northwest
	neighborCells.push(grid[(rows) * x + lookUp]); // north
	neighborCells.push(grid[(rows) * lookRight + lookUp]); // northeast

	neighborCells.push(grid[(rows) * lookLeft + y]); // west
	neighborCells.push(grid[(rows) * lookRight + y]); // east

	neighborCells.push(grid[(rows) * lookLeft + lookDown]); // southwest
	neighborCells.push(grid[(rows) * x + lookDown]); // south
	neighborCells.push(grid[(rows) * lookRight + lookDown]); // southeast

	return neighborCells;
}

function renderGrid(grid) {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			const x = i * cellSize;
			const y = j * cellSize;
			if (grid[i * rows + j].isAlive) {
				fill(255);
				stroke(0);
				rect(x, y, cellSize - 1, cellSize - 1);
			}
		}
	}
}
//#endregion Helper methods for Game of Life.

class Cell {
	constructor(row, col, isAlive, liveNeighbors) {
		this.x = row;
		this.y = col;
		this.isAlive = isAlive;
		this.liveNeighbors = liveNeighbors;
	}
}

//#region Drop area.
function dropHandler(event) {
	event.preventDefault();
	if (event.dataTransfer.items) {
		event.dataTransfer.items.forEach(item => {
			if (item.kind === 'file') {
				const file = item.getAsFile();
				if (file.name.includes('.life') || file.name.includes('.lif')) {
					populateGridFromFile(file);
				}
			}
		});
	}
}

function populateGridFromFile(file) {
	let reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function () {
		clearGrid(grid);
		const content = reader.result;
		let lines = content.split('\n');
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].split(' ');
			const x = Number.parseInt(line[0]);
			const y = Number.parseInt(line[1]);

			// Skip negative numbers and numbers greater than the biggest number JavaScript can handle (2^53 - 1).
			if (x < 0 || x > Number.MAX_SAFE_INTEGER || y < 0 || y > Number.MAX_SAFE_INTEGER) {
				continue;
			}

			grid[x * rows + y] = new Cell(x, y, true, 0);
		}

		// Loop through grid again to update live neighbors for all cells.
		grid.forEach(cell => {
			cell.liveNeighbors = countLiveNeighbors(grid, cell);
		});

		numGenerations = 10;
	}

	reader.onerror = function () {
		console.error(reader.error);
	}
}

function dragOverHandler(event) {
	event.preventDefault();
}
//#endregion Drop area.