const animateClass = 'animate__animated';
const randomQuotes = [
	'<i>"Man, Ryan is so cool.</i>" -not Ryan',
	'<i>"My I.Q. is one of the highest - and you all know it!"</i>" -45',
	'<i>"An SSL error has occurred and a secure connection to the server could not be made"</i>" -Shakespeare',
	'<i>"My hope is that this code is so awful I\'m never allowed to write UI code again"</i>" -Value programmer',
	'<i>"This shit doesn\'t work!! Why? Has I ever?"</i>" -Valve programmer',
	'<i>"All your base are belong to us"</i>" -CATS',
	'<i>"This guy are sick"</i>" -Aerith',
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