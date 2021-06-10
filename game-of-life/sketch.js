/*
	Current implementation does not deal with significantly large numbers nor negative numbers in file input -- will
	discuss implementation with such numbers during interview.
*/

let grid;
let cols, rows;
const resolution = 10; // Size of squares.
let numGenerations = -99;

function setup() {
	createCanvas(1200, 800);
	cols = width / resolution;
	rows = height / resolution;

	grid = makeGrid(cols, rows);

	// Randomize grid.
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j, Math.random() < 0.5, 0);
		}
	}

	// Loop through grid again to update live neighbors for all cells.
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].liveNeighbors = countLiveNeighbors(grid, i, j);
		}
	}
}

function draw() {
	// Render grid.
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			const x = i * resolution;
			const y = j * resolution;
			if (grid[i][j].isAlive) {
				fill(255);
				stroke(0);
				rect(x, y, resolution - 1, resolution - 1);
			}
		}
	}

	if (numGenerations > 0 || numGenerations <= -99) {
		background(0, 70);

		// Compute next generation based on current grid.
		const dirtyCellsList = [];
		const liveCellsList = [];
		let next = makeGrid(cols, rows);

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const cell = grid[i][j];

				if (!cell.isAlive && cell.liveNeighbors == 3) {
					next[i][j] = new Cell(i, j, true, cell.liveNeighbors);

					const dirtyCell = {};
					dirtyCell.x = i;
					dirtyCell.y = j;
					dirtyCell.isAlive = true;
					dirtyCellsList.push(dirtyCell);

					// We only care about what's left on the final generation.
					if (numGenerations == 1) {
						liveCellsList.push(dirtyCell);
					}

				} else if (cell.isAlive && (cell.liveNeighbors < 2 || cell.liveNeighbors > 3)) {
					next[i][j] = new Cell(i, j, false, cell.liveNeighbors);

					const dirtyCell = {};
					dirtyCell.x = i;
					dirtyCell.y = j;
					dirtyCell.isAlive = false;
					dirtyCellsList.push(dirtyCell);

				} else {
					next[i][j] = cell;
					if (cell.isAlive) {
						liveCellsList.push(cell);
					}
				}
			}
		}

		// Loop through grid again to update live neighbors for all cells.
		dirtyCellsList.forEach(cell => updateNeighbors(next, cell));

		grid = next;
		numGenerations--;

		if (numGenerations == 0) {
			console.log('#Life 1.06');
			liveCellsList.forEach(cell => console.log(cell.x + ' ' + cell.y));
		}
	}

	background(0, 5);
}

// Makes 2-D array for grid.
function makeGrid(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

// Resets all cells in grid.
function clearGrid(grid) {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j, false, 0);
		}
	}
}

// Count live neighbors for the cell at a given position.
function countLiveNeighbors(grid, x, y) {
	let sum = 0;

	// Loop through neighboring cells.
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			// Skip if cell is self.
			if (x + i == x && y + j == y) continue;

			// Stitch all edges together.
			const col = (x + i + cols) % cols;
			const row = (y + j + rows) % rows;

			if (grid[col][row].isAlive) {
				sum += 1;
			}
		}
	}

	return sum;
}

// Update neighbor's live neighbors count for dirty cells.
function updateNeighbors(grid, cell) {
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			// Skip if cell is self.
			if (cell.x + i == cell.x && cell.y + j == cell.y) continue;

			// Stitch all edges together.
			const col = (cell.x + i + cols) % cols;
			const row = (cell.y + j + rows) % rows;

			grid[col][row].liveNeighbors = grid[col][row].liveNeighbors + (cell.isAlive ? 1 : -1);
		}
	}
}


// Drop area logic.
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
	
	reader.onload = function() {
		clearGrid(grid);
		const content = reader.result;
		let lines = content.split('\n');
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].split(' ');
			const x = line[0];
			const y = line[1];
			grid[x][y] = new Cell(x, y, true, 0);
		}

		// Loop through grid again to update live neighbors for all cells.
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				grid[i][j].liveNeighbors = countLiveNeighbors(grid, i, j);
			}
		}

		numGenerations = 10;
	}

	reader.onerror = function() {
		console.error(reader.error);
	}
}

function dragOverHandler(event) {
	event.preventDefault();
}

class Cell {
	constructor(row, col, isAlive, liveNeighbors) {
		this.x = row;
		this.y = col;
		this.isAlive = isAlive;
		this.liveNeighbors = liveNeighbors;
	}
}