const TABLE = document.getElementById("sequencer");
const SLIDER = document.getElementById("sequencerSlider");
const SLIDER_VALUE = document.getElementById("sliderValue");
const TITLE = document.getElementById("title");
const AUTHOR = document.getElementById("author");

const NUM_ROWS = 8;
const NUM_COLS = 16;
const DELAY = 120;

const OFF_COLOR = "dimgray";
const FOCUS_COLOR = "gray";
const PLAY_COLOR = "white";
const COLOR_ARRAY = [
	"#63EB9A", "#51E8D9", "#55A9F2", "#5A58DB", "#B255F2", "#EB66C2", "#EB6C65", "#EBC169"
]

const SOUND_ID = "sound";

let currentColumn = 0;
let board = [];
let intervalId;
let currentInstrument;

class SequencerBeat {
	constructor(row, col, cell, beat, label, onColor) {
		this.row = row;
		this.col = col;
		this.cell = cell;
		this.beat = beat;
		this.label = label;
		this.onColor = onColor;
	}

	clicked() {
		this.beat.click();
	}

	setColor(color) {
		if (typeof color !== "undefined") {
			this.label.style.color = color;
			this.label.style.backgroundColor = color;
		} else {
			this.label.style.color = this.beat.checked ? this.onColor : OFF_COLOR;
			this.label.style.backgroundColor = this.beat.checked ? this.onColor : OFF_COLOR;
		}
	}
}

function setupSequencer() {
	for (var r = 0; r < NUM_ROWS; r++) {
		let row = TABLE.insertRow(r);
		for (var c = 0; c < NUM_COLS; c++) {
			let col = row.insertCell(c);
			col.classList.add("sequencerCell");
			col.style.height = "60px";
			col.style.backgroundColor = "gray";
			col.style.overflow = "hidden";
			col.style.padding = 0;
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
	label.style.width = "5vw";
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

	let color = COLOR_ARRAY[row];

	return new SequencerBeat(row, col, cell, beat, label, color);
}

function beatClicked(beat, label, col) {
	col.style.backgroundColor = beat.checked ? beat.onColor : OFF_COLOR;
	label.style.color = beat.checked ? beat.onColor : OFF_COLOR;
	label.style.backgroundColor = beat.checked ? beat.onColor : OFF_COLOR;
}

function setupSlider() {
	SLIDER_VALUE.innerHTML = SLIDER.value;
	SLIDER.oninput = function () {
		setSliderValue(this.value);
	}
}

function setSliderValue(bpm) {
	SLIDER.value = bpm;
	SLIDER_VALUE.innerHTML = bpm;
	clearInterval(intervalId);
	intervalId = runSequencer();
}

function runSequencer() {
	return setInterval(playColumnAudio, SLIDER_VALUE.innerHTML);
}

function loadCreation(callback) {
	let xObj = new XMLHttpRequest();
	xObj.overrideMimeType("application/json");
	xObj.open('GET', '/static/creativity/creations/sequencer/creation0.json', true);
	xObj.onreadystatechange = function () {
		if (xObj.readyState == 4 && xObj.status == "200") {
			callback(JSON.parse(xObj.responseText));
		}
	};
	xObj.send(null);
}

function loadBeats(notes) {
	notes.forEach(note => checkBeat(note));
}

function checkBeat(note) {
	if (!board[note].beat.checked) board[note].clicked();
}

function resetBoard() {
	board.forEach(beat => beat.beat.checked = false);
	setSliderValue(120);
	TITLE.placeholder = "UNTITLED";
	TITLE.value = "";
	TITLE.disabled = false;
	AUTHOR.innerHTML = "by YOU";
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

function loadData() {
	resetBoard();
	loadCreation(function (json) {
		TITLE.value = json.title;
		TITLE.disabled = true;
		AUTHOR.innerHTML = "by " + json.author;
		loadSound(json.data.instrument);
		setSliderValue(json.data.bpm);
		loadBeats(json.data.notes);
	});

	return "data loaded!";
}

setupSequencer();
loadSound("heavy-drum");
setupSlider();
intervalId = runSequencer();

function loadSound(instrument) {
	currentInstrument = instrument;
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

function switchInstruments() {
	if (currentInstrument == "heavy-drum")
		loadSound("vibraphone");
	else if (currentInstrument == "vibraphone")
		loadSound("big-room-drum");
	else
		loadSound("heavy-drum");
}