const embedLink = "https://www.youtube.com/embed?autoplay=1&listType=playlist&list=";

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
}