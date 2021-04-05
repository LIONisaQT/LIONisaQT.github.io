const embedLink = "https://www.youtube.com/embed?listType=playlist&list=";

function submit(event) {
	if (event.keyCode === 13) {
		let input = document.getElementById("input").value;
		refreshPlaylist(input);
	}
}

function refreshPlaylist(playlistId) {
	let iframe = document.getElementById("playlist");
	iframe.src = "";
	iframe.src = embedLink + playlistId;
}