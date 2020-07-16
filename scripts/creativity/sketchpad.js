const swatchWidth = 40;
const swatchHeight = 60;

let canvas;
let currentColor;

function setup() {
	canvas = createCanvas(400, 500);
	canvas.parent('sketchpad-div');
	resetCanvas();
}

function askToResetCanvas() {
	if (confirm("Are you sure? Your canvas will be wiped clean, colors will be randomly reassigned, and prompt line will be redrawn.")) {
		resetCanvas();
	}
}

function resetCanvas() {
	background(255);
	strokeWeight(4);
	makeRandomBezierVertex(2);
	strokeWeight(2);
	setupSwatch();
}

function mouseClicked() {
	if (mouseY > canvas.height - swatchHeight)
		currentColor = get(mouseX, mouseY);
	if (currentColor != undefined)
		stroke(currentColor);

	let white = [255, 255, 255, 255];
	if (arraysEqual(currentColor, white))
		strokeWeight(20);
	else
		strokeWeight(2);
}

function mouseDragged() {
	if (pmouseY <= canvas.height - swatchHeight && mouseY <= canvas.height - swatchHeight)
		line(pmouseX, pmouseY, mouseX, mouseY);
}

function makeRandomBezierVertex(numBezier) {
	beginShape();
	stroke(0);
	vertex(random(canvas.width), random(canvas.height));
	for (let i = 0; i < numBezier; i++) {
		bezierVertex(
			random(canvas.width),
			random(canvas.height),
			random(canvas.width),
			random(canvas.height),
			random(canvas.width),
			random(canvas.height),
		)
	}
	endShape();
}

function setupSwatch() {
	noStroke();
	for (let i = 0; i < 10; i++) {
		if (i == 9)
			new ColorSwatch(i * 40, 255, 255, 255);
		else {
			let c = color(random(255), random(255), random(255));
			if (i == 0) currentColor = c;
			new ColorSwatch(i * 40, c);
		}
	}
	stroke(currentColor);
}

class ColorSwatch {
	constructor(xPos, r, g, b) {
		fill(r, g, b);
		rect(xPos, canvas.height - swatchHeight, swatchHeight);
	}
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) {
		if (a[i] != b[i]) return false;
	}

	return true;
}