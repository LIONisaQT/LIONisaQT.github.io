let modalOpen = false;

function openModal(target) {
	let card = document.getElementById(target.id);                     // Get card
	let modal = document.getElementById(target.id + '-modal');         // Get card's modal
	let close = document.getElementById(target.id + '-close');         // Get modal's close
	let closeBtn = document.getElementById(target.id + '-close-btn');  // Get modal's close button
	let body = document.getElementsByTagName("body")[0];               // Get body to disable scroll

	card.onclick = function() {
		modalOpen = true;
		modal.style.display = "block";
		body.style.overflow = "hidden";
		modal.scrollTop = 0;
	}

	close.onclick = function() {
		modalOpen = false;
		modal.style.display = "none";
		body.style.overflow = "visible";
	}

	closeBtn.onclick = function() {
		modalOpen = false;
		modal.style.display = "none";
		body.style.overflow = "visible";
	}
}
