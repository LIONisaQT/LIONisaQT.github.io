const TABLE = document.getElementById("sequencer");
const SLIDER = document.getElementById("sequencerSlider");
const SLIDER_VALUE = document.getElementById("sliderValue");
const NUM_ROWS = 8;
const NUM_COLS = 16;
const DELAY = 120;
const OFF_COLOR = "gray";
const ON_COLOR = "lightseagreen";
const FOCUS_COLOR = "lightblue";
const PLAY_COLOR = "white";
const SOUND_ID = "sound";

let currentColumn = 0;
let board = [];
let intervalId;

class SequencerBeat {
	constructor(row, col, cell, beat, label) {
		this.row = row;
		this.col = col;
		this.cell = cell;
		this.beat = beat;
		this.label = label;
	}

	clicked() {
		this.beat.click();
	}

	setColor(color) {
		if (typeof color !== "undefined") {
			this.label.style.color = color;
			this.label.style.backgroundColor = color;
		} else {
			this.label.style.color = this.beat.checked ? ON_COLOR : OFF_COLOR;
			this.label.style.backgroundColor = this.beat.checked ? ON_COLOR : OFF_COLOR;
		}
	}
}

function setupSequencer() {
	for (var r = 0; r < NUM_ROWS; r++) {
		let row = TABLE.insertRow(r);
		for (var c = 0; c < NUM_COLS; c++) {
			let col = row.insertCell(c);
			col.classList.add("sequencerCell");
			col.style.height = "80px";
			col.style.backgroundColor = "gray";
			col.style.overflow = "hidden";
			let beat = createBeatButton(r, c, col);
			beat.beat.onclick = function () {
				beatClicked(beat.beat, beat.label, beat.cell);
			}
			board.push(beat);
		}
	}
}

function createBeatButton(row, col, cell) {
	let forIdAttribute = row + "-" + col;

	let label = document.createElement("label");
	label.classList.add("beat");
	label.style.display = "block";
	label.style.color = OFF_COLOR;
	label.style.backgroundColor = OFF_COLOR;
	label.style.width = "4vw";
	label.style.height = "100%";
	label.style.userSelect = "none";
	label.setAttribute("for", forIdAttribute);
	cell.appendChild(label);

	let beat = document.createElement("input");
	beat.id = forIdAttribute;
	beat.type = "checkbox";
	beat.classList.add("visually-hidden");
	beat.style.opacity = 0;
	beat.style.position = "absolute";
	beat.style.top = 0;
	beat.style.left = 0;
	cell.appendChild(beat);

	return new SequencerBeat(row, col, cell, beat, label);
}

function beatClicked(beat, label, col) {
	col.style.backgroundColor = beat.checked ? ON_COLOR : OFF_COLOR;
	label.style.color = beat.checked ? ON_COLOR : OFF_COLOR;
	label.style.backgroundColor = beat.checked ? ON_COLOR : OFF_COLOR;
}

function setupSlider() {
	SLIDER_VALUE.innerHTML = SLIDER.value;
	SLIDER.oninput = function () {
		SLIDER_VALUE.innerHTML = this.value;
		clearInterval(intervalId);
		intervalId = runSequencer();
	}
}

function runSequencer() {
	return setInterval(playColumnAudio, SLIDER_VALUE.innerHTML);
}

function playColumnAudio() {
	for (var i = 0; i < board.length; i++) {
		if (i % NUM_COLS === currentColumn) {
			if (board[i].beat.checked) {
				createjs.Sound.play(Math.floor(i / NUM_COLS));
				board[i].setColor(PLAY_COLOR);
			} else {
				board[i].setColor(FOCUS_COLOR);
			}
		} else {
			board[i].setColor();
		}
	}

	currentColumn++;
	if (currentColumn >= NUM_COLS) currentColumn = 0;
}

setupSequencer();
loadSound("heavy-drum");
setupSlider();
intervalId = runSequencer();

function loadSound(instrument) {
	let audioPath = "/static/creativity/sounds/" + instrument + "/";

	let sounds = [];
	for (var i = 0; i < NUM_ROWS; i++) {
		let note = {
			id: i.toString(),
			src: i.toString() + ".mp3"
		};
		sounds.push(note);
	}
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.registerSounds(sounds, audioPath);
}