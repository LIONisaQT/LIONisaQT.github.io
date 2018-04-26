// Tilts cards based on mouse position
/*
  Tried to make tilt scale off distance from center, but tilt
  would stutter/was not smooth, so I ditched it for now.
*/
function tiltCard(event, target) {
	// let multiplier = 4;

	// Get mouse position
	let mouseX = event.clientX;
	let mouseY = event.clientY;

	// Get hitbox of card basically
	let position = target.getBoundingClientRect();

	// Center of card
	let centerX = position.left + position.width / 2;
	let centerY = position.top + position.height / 2;

	// Set rotations
	let rotX, rotY;

	if (mouseX > centerX) {
		rotY = -3;
		// rotY = -mouseX/centerX * multiplier;
	} else if (mouseX < centerX) {
		rotY = 3;
		// rotY = mouseX/centerX * multiplier;
	} else {
		rotY = 0;
	}

	if (mouseY > centerY) {
		rotX = 3;
		// rotX = mouseY/centerY * multiplier;
	} else if (mouseY < centerY) {
		rotX = -3;
		// rotX = -mouseY/centerY * multiplier;
	} else {
		rotX = 0;
	}

	// Change transform
	target.style.transform = "perspective(300px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
}

// Resets card's transform
function resetCard(target) {
	target.style.transform = "";
}
