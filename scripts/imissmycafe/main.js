const playlistEmbedLink = "https://www.youtube.com/embed?autoplay=1&loop=1&listType=playlist&list=";
const singleEmbedLink = "https://www.youtube.com/embed/";
const singleAddParams = "?autoplay=1&loop=1";

const defaultPlaylist = "https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq";

const lofiPlaylists = [
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
];

const kpopPlaylists = [
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
];

const jpopPlaylists = [
	"https://www.youtube.com/watch?v=VGMrcfpg0h8",
	"https://www.youtube.com/watch?v=sRiruE1FaIQ",
];

const animePlaylists = [
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
];

const gamesPlaylists = [
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
	"https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq",
];

const bgSounds = ["Rain", "Forest", "Beach", "Fireplace", "Flight"];

const playlistUrlMap = new Map();
const playlistFragmentMap = new Map();
initializeMap();
createFragments();

let playlistHolder = "Lo-fi";
let currentPlaylist = playlistHolder;
let currentIndex = 1;
let currentBackground = "Rain";

let somethingOpen = false;

window.onload = function() {
	changePlaylist(defaultPlaylist);
	registerEvents();
	manageURLArgs();
};

function playlistSelected(playlistName) {
	// Close dropdown.
	dropdownLeave(null, 'playlist');

	// Save playlist name temporarily.
	playlistHolder = playlistName;

	manageSelectedOption('playlist', playlistName);

	// Clear div of all child elements.
	const playlistParent = document.getElementById('playlist-parent');
	playlistParent.innerHTML = '';

	const input = document.getElementById('playlist-input');

	// Add playlists as children to div.
	if (playlistName != "Use My Own") {
		let lists = playlistFragmentMap.get(playlistName);
		playlistParent.appendChild(lists);
		initializeMap();
		createFragments();

		if (playlistName == currentPlaylist) {
			uncolorSubPlaylists(currentIndex);
		}
		
		playlistParent.style.display = 'inline-block'
		input.style.display = 'none';
	} else {
		playlistParent.style.display = 'none';
		input.style.display = 'block';
	}
}

function subPlaylistSelected(event, index) {
	currentPlaylist = playlistHolder;
	currentIndex = parseInt(index);
	uncolorSubPlaylists(index);
	buildURL();
	changePlaylist(playlistUrlMap.get(currentPlaylist)[currentIndex - 1]);
}

function uncolorSubPlaylists(index) {
	let nodes = document.getElementById('playlist-parent').childNodes;
	nodes.forEach(node => {
		if (node.style != undefined) {
			node.style.color = 'white';
			node.style.borderBottom = '2px solid transparent';
		}
	});

	let subPlaylist = document.getElementById(index);
	subPlaylist.style.color = '#a7bfff';
	subPlaylist.style.borderBottom = '2px solid #a7bfff';
}

function backgroundSelected(background) {
	dropdownLeave(null, 'background');
	currentBackground = background;
	manageSelectedOption('background', background);
	buildURL();
}

// TODO: Utility methods, move to another JS file.
function initializeMap() {
	playlistUrlMap.set('Lo-fi', lofiPlaylists);
	playlistUrlMap.set('K-pop', kpopPlaylists);
	playlistUrlMap.set('J-pop', jpopPlaylists);
	playlistUrlMap.set('Anime', animePlaylists);
	playlistUrlMap.set('Games', gamesPlaylists);
}

function createFragments() {
	for (const playlist of playlistUrlMap.keys()) {
		const list = playlistUrlMap.get(playlist);
		const fragment = document.createDocumentFragment();
		list.forEach((item, i) => {
			let el = document.createElement('p');
			el.id = i + 1;
			let num = document.createTextNode(padWithZeroes(el.id, 2));
			if (el.addEventListener) {
				el.addEventListener('click', e => subPlaylistSelected(e, el.id), false);
			} else {
				el.attachEvent('onclick',  e => subPlaylistSelected(e, el.id));
			}
			el.appendChild(num);
			fragment.appendChild(el);
		})
		playlistFragmentMap.set(playlist, fragment);
	}
}

function registerEvents() {
	let playlistParent = document.getElementById('playlist-select');
	playlistParent.addEventListener('mouseover', e => resizeDropdownWidth(e, 'playlist'));

	let playlistArea = document.getElementById('playlist-area');
	playlistArea.addEventListener('mouseleave', e => dropdownLeave(e, 'playlist'));

	let backgroundParent = document.getElementById('background-select');
	backgroundParent.addEventListener('mouseover', e => resizeDropdownWidth(e, 'background'));

	let backgroundArea = document.getElementById('background-area');
	backgroundArea.addEventListener('mouseleave', e => dropdownLeave(e, 'background'));
}

function dropdownLeave(event, type) {
	if (type != undefined) {
		somethingOpen = false;

		let dropdown = document.getElementById(type + '-dropdown');
		dropdown.style.display = "none";

		let select = document.getElementById(type + '-select');
		select.style.borderBottomLeftRadius = '6px';
		select.style.borderBottomRightRadius = '6px';
	}
}

function dropdownClicked(type) {
	somethingOpen = !somethingOpen;

	if (somethingOpen) {
		let dropdown = document.getElementById(type + '-dropdown');
		dropdown.style.display = 'block';

		let select = document.getElementById(type + '-select');
		select.style.borderBottomLeftRadius = '0px';
		select.style.borderBottomRightRadius = '0px';
	} else {
		dropdownLeave(null, type);
	}
}

function resizeDropdownWidth(event, element) {
	let playlistSelect = document.getElementById(element + '-select');
	let buttonSize = playlistSelect.offsetWidth;
	let dropdownParent = document.getElementById(element + '-dropdown');
	dropdownParent.style.width = (buttonSize - 4) + 'px'; // -4 because the dropdown's box shadow is 2 pixels on both sides
}

function manageURLArgs() {
	let url = window.location.href;
	if (url.includes('#')) {
		url = url.substr(url.indexOf('#') + 1);
		const args = url.split(',');
		let playlist = args[0];

		// If we're using our own playlist, check localStorage for it. Play lo-fi if it doesn't exist.
		if (playlist === 'Use My Own') {
			let lastId = localStorage.getItem('lastPlaylistId');
			if (lastId != null) {
				let iframe = document.getElementById('playlist');
				if (!iframe.src.includes(lastId)) {
					refreshPlaylist(lastId);
				}
			} else {
				playlistSelected(args[0]);
			}
		} else {
			playlistSelected(args[0]);
		}

		subPlaylistSelected(null, parseInt(args[1]));
		backgroundSelected(args[2]);
	} else {
		playlistSelected('Lo-fi');
		backgroundSelected('Rain');
	}
}

function manageSelectedOption(type, option) {
	// Change button text.
	let select = document.getElementById(type + '-select');
	select.innerHTML = option;

	// Set currently selected background name in the dropdown.
	let nodes = document.getElementById(type + '-dropdown').childNodes;
	nodes.forEach(node => {
		if (node.style != undefined) {
			if (node.innerHTML.indexOf(' ✓') > -1) {
				node.innerHTML = node.innerHTML.substr(0, node.innerHTML.indexOf(' ✓'));
				node.style.fontWeight = "normal";
			}
		}
	});

	// Set style of selected background.
	let selection = document.getElementById(option);
	selection.innerHTML = selection.innerHTML + ' ✓';
	selection.style.fontWeight = "bold";
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

function padWithZeroes(number, length) {
	let paddedString = '' + number;
	while (paddedString.length < length) {
		paddedString = '0' + paddedString;
	}

	return paddedString;
}

function submit(event) {
	if (event.keyCode === 13) {
		let input = document.getElementById("input");
		refreshPlaylist(input.value);
	}
}

function refreshPlaylist(playlistId) {
	let iframe = document.getElementById("playlist");
	iframe.src = "";
	iframe.src = playlistEmbedLink + playlistId;

	let input = document.getElementById("input");
	input.value = "";

	localStorage.setItem("lastPlaylistId", playlistId);
}

function changePlaylist(playlist) {
	const videoData = getYoutubeId(playlist);
	let iframe = document.getElementById("playlist");
	iframe.src = "";

	let source = (videoData[0] ? playlistEmbedLink : singleEmbedLink) + videoData[1];
	
	console.log('before: ' + source);
	if (getLoopStatus()) {
		source = source.replace('loop=0', 'loop=1');
	} else {
		source = source.replace('loop=1', 'loop=0')
	}
	console.log('after: ' + source);

	iframe.src = source;
}

function getYoutubeId(playlist) {
	let isPlaylist = false;
	let videoId = "";

	if (playlist.includes('&list=')) {
		isPlaylist = true;
		videoId = playlist.substr(playlist.indexOf('&list=') + 6);
	} else {
		videoId = playlist.substr(playlist.indexOf('watch?v=') + 8) + singleAddParams;
	}

	return [isPlaylist, videoId];
}

function getLoopStatus() {
	return document.getElementById('loop-checkbox').checked;
}