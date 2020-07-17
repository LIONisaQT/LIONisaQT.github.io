const animateClass = 'animate__animated';
const randomQuotes = [
	'<i>"Man, Ryan is so cool.</i>" -not Ryan',
	'<i>"My I.Q. is one of the highest - and you all know it!"</i>" -45',
]

function creativeClick() {
	document.getElementById('explore').scrollIntoView();

	var title = document.getElementById('theme-title');
	if (!title.classList.contains(animateClass)) {
		title.classList.add(animateClass);
		title.classList.add('animate__fadeIn');
		title.classList.add('animate__delay-1s');
	}

	var themeFlavor = document.getElementById('theme-flavor');
	if (!themeFlavor.classList.contains(animateClass)) {
		themeFlavor.classList.add(animateClass);
		themeFlavor.classList.add('animate__fadeIn');
		themeFlavor.classList.add('animate__delay-2s');
	}
}

function randomTheme() {
	var theme = document.getElementById('quote');
	theme.innerHTML = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
}

randomTheme();