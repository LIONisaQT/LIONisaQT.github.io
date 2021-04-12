const embedLink = "https://www.youtube.com/embed?autoplay=1&listType=playlist&list=";

var currentPlaylist = "lofi";
var currentIndex = 0;
var currentBackground = "rain";

window.onload = function() {
	let lastId = localStorage.getItem("lastPlaylistId");
	if (lastId != null) {
		let iframe = document.getElementById("playlist");
		if (!iframe.src.includes(lastId)) {
			refreshPlaylist(lastId);
		}
	}
};

function submit(event) {
	if (event.keyCode === 13) {
		let input = document.getElementById("input");
		refreshPlaylist(input.value);
	}
}

function refreshPlaylist(playlistId) {
	let iframe = document.getElementById("playlist");
	iframe.src = "";
	iframe.src = embedLink + playlistId;

	let input = document.getElementById("input");
	input.value = "";

	localStorage.setItem("lastPlaylistId", playlistId);
}

function playlistSelected(playlist) {
	currentPlaylist = playlist;
	buildURL();
}

function backgroundSelected(background) {
	currentBackground = background;
	buildURL();
}

function buildURL() {
	let url = window.location.href;
	let args = currentPlaylist + "," + currentIndex + "," + currentBackground;

	if (url.includes('#')) {
		let baseURL = url.substr(0, url.indexOf('#'));
		window.location.href = baseURL + "#" + args;
	} else {
		window.location.href += "#" + args;
	}
}