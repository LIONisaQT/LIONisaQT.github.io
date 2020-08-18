const TABLE = document.getElementById("sequencer");
const NUM_ROWS = 10;
const NUM_COLS = 10;
const DELAY = 126;
const OFF_COLOR = "gray";
const ON_COLOR = "lightseagreen";
const FOCUS_COLOR = "lightblue";
const PLAY_COLOR = "white";
const SOUND_ID = "sound";

let currentColumn = 0;
let board = [];

class SequencerBeat {
	constructor(row, col, beat, label) {
		this.row = row;
		this.col = col;
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
			col.style.width = "30px";
			col.style.overflow = "hidden";
			let beat = createBeatButton(r, c, col);
			beat.beat.onclick = function () {
				beatClicked(beat.beat, beat.label);
			}
			board.push(beat);
		}
	}
}

function createBeatButton(row, col, cell) {
	let forIdAttribute = row + "-" + col;

	let label = document.createElement("label");
	label.classList.add("beat");
	label.style.color = OFF_COLOR;
	label.style.backgroundColor = OFF_COLOR;
	label.style.userSelect = "none";
	label.innerHTML = "BEAT\nBEAT";
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

	return new SequencerBeat(row, col, beat, label);
}

function beatClicked(beat, label) {
	label.style.color = beat.checked ? ON_COLOR : OFF_COLOR;
	label.style.backgroundColor = beat.checked ? ON_COLOR : OFF_COLOR;
}

function runSequencer() {
	setInterval(playColumnAudio, DELAY);
}

function playColumnAudio() {
	for (var i = 0; i < board.length; i++) {
		if (i % NUM_ROWS === currentColumn) {
			console.log("CHECKING ROW " + (i % NUM_ROWS));
			if (board[i].beat.checked) {
				let formattedNumber = ("0" + i).slice(-2);
				createjs.Sound.play(formattedNumber.toString()[0]);
				console.log(i + " to be played!");
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
loadSound();
runSequencer();

function loadSound() {
	let audioPath = "/static/creativity/sounds/";
	let sounds = [{
			id: "0",
			src: "piano-09.ogg"
		},
		{
			id: "1",
			src: "piano-08.ogg"
		},
		{
			id: "2",
			src: "piano-07.ogg"
		},
		{
			id: "3",
			src: "piano-06.ogg"
		},
		{
			id: "4",
			src: "piano-05.ogg"
		},
		{
			id: "5",
			src: "piano-04.ogg"
		},
		{
			id: "6",
			src: "piano-03.ogg"
		},
		{
			id: "7",
			src: "piano-02.ogg"
		},
		{
			id: "8",
			src: "piano-01.ogg"
		},
		{
			id: "9",
			src: "piano-00.ogg"
		}
	];
	createjs.Sound.registerSounds(sounds, audioPath);
}