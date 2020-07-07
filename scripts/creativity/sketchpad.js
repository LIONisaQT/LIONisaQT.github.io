const swatchWidth = 40;
const swatchHeight = 60;

let canvas;
let currentColor;

function setup() {
	canvas = createCanvas(400, 500);
	canvas.parent('sketchpad-div');
	background(255);

	setupSwatch();
}

function draw() {}

function mouseClicked() {
	if (mouseY > canvas.height - swatchHeight)
		currentColor = get(mouseX, mouseY);
	if (currentColor != undefined)
		stroke(currentColor);
}

function mouseDragged() {
	if (pmouseY < canvas.height - swatchHeight && mouseY < canvas.height - swatchHeight)
		line(pmouseX, pmouseY, mouseX, mouseY);
}

function setupSwatch() {
	noStroke();
	for (let i = 0; i < 10; i++) {
		if (i == 9)
			new ColorSwatch(i * 40, 255, 255, 255);
		else
			new ColorSwatch(i * 40, random(255), random(255), random(255));
	}
	stroke(0);
}

class ColorSwatch {
	constructor(xPos, r, g, b) {
		fill(r, g, b);
		rect(xPos, canvas.height - swatchHeight, swatchHeight);
	}
}