const defaultPlaylist = "https://www.youtube.com/watch?v=SlUYv-CUoOo&list=PL9Xuki_HcjmBJPp_ku7MHmJke1jtc_QTq";

const lofiPlaylists = [
	"https://www.youtube.com/watch?v=gMZhRJ5354o&list=PLvlw_ICcAI4fShFuH9p4ugLuv75jyDjbu",
	"https://www.youtube.com/playlist?list=PLcghjaDFUHglje0wiMUDMTrUV6z5wGGQq",
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

const bgSounds = ["Rain", "Forest", "Beach", "Fireplace", "Flight", "Cafe"];
let bgInstance;

let playlistHolder = "Lo-fi";
let currentPlaylist = playlistHolder;
let currentIndex = 1;
let currentBackground = "Rain";
let customUrl;

const playlistUrlMap = new Map();
const playlistFragmentMap = new Map();

initializeMap();
createFragments();
manageLocalStorage();
// TODO: Right now sounds are independant of one another, we can have them all play at once when they're ready
// by using YouTube's player state and createjs' sound load status. ALSO YouTube player requires focus before
// autoplaying; sound does not; this might be something we want to change.
loadSounds();

let somethingOpen = false;

window.onload = function() {
	registerEvents();
};

const tag = document.createElement('script');
tag.id = 'iframe';
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	playlistSelected(currentPlaylist);

	let playlistData;
	if (currentPlaylist == "Use My Own" && (customUrl != null || customUrl != '')) {
		playlistData = getYoutubeId(customUrl);
	} else {
		playlistData = getYoutubeId(playlistUrlMap.get(currentPlaylist)[currentIndex - 1]);
		subPlaylistSelected(null, currentIndex);
	}
	
	player = new YT.Player('player', {
		playerVars: {
			'autoplay': 1,
			'fs': 0,
			'loop': getLoopStatus() ? 1 : 0,
			'origin': 'https://ryanshee.com/',
			'listType': playlistData[0],
			'list': playlistData[1],
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	let playlistData;
	if (currentPlaylist == "Use My Own" && (customUrl != null || customUrl != '')) {
		playlistData = customUrl;
	} else {
		playlistData = playlistUrlMap.get(currentPlaylist)[currentIndex - 1];
	}

	changePlaylist(playlistData);
}

function onPlayerStateChange(event) {
	// Do stuff with on pause, on play, etc. here.
}

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
	if (playlistName != "Use My Own") {
		// Add playlists as children to div.
		let lists = playlistFragmentMap.get(playlistName);
		playlistParent.appendChild(lists);

		// Regenerate maps because fragment because JavaScript is shallow.
		initializeMap();
		createFragments();

		// Update subplaylist styles to only highlight current subplaylist.
		if (playlistName == currentPlaylist) {
			updateSubPlaylistStyle(currentIndex);
		}
		
		// Hide input field and show subplaylist div.
		playlistParent.style.display = 'inline-block'
		input.style.display = 'none';
	} else {
		// Show input field and hide subplaylist div.
		playlistParent.style.display = 'none';
		input.style.display = 'block';
	}
}

function subPlaylistSelected(event, index) {
	currentPlaylist = playlistHolder;
	currentIndex = parseInt(index);
	updateSubPlaylistStyle(index);
	changePlaylist(playlistUrlMap.get(currentPlaylist)[currentIndex - 1]);
}

function updateSubPlaylistStyle(index) {
	let nodes = document.getElementById('playlist-parent').childNodes;
	nodes.forEach(node => {
		if (node.style != undefined) {
			node.style.color = 'white';
			node.style.borderBottom = '2px solid transparent';
		}
	});

	let subPlaylist = document.getElementById(index);
	if (subPlaylist != null) {
		subPlaylist.style.color = '#a7bfff';
		subPlaylist.style.borderBottom = '2px solid #a7bfff';
	}
}

function backgroundSelected(background) {
	dropdownLeave(null, 'background');
	currentBackground = background;
	manageSelectedOption('background', background);
	if (createjs.Sound.loadComplete(background)) {
		playBackgroundAudio(background);
	}
	saveData();
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

function manageLocalStorage() {
	if (localStorage.getItem('currentPlaylist') != null) {
		currentPlaylist = localStorage.getItem('currentPlaylist');

		if (currentPlaylist == 'Use My Own') {
			customUrl = localStorage.getItem('customUrl');
		}
	}

	if (localStorage.getItem('currentIndex') != null) {
		currentIndex = localStorage.getItem('currentIndex');
	}

	if (localStorage.getItem('background') != null) {
		currentBackground = localStorage.getItem('background');
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

function padWithZeroes(number, length) {
	let paddedString = '' + number;
	while (paddedString.length < length) {
		paddedString = '0' + paddedString;
	}

	return paddedString;
}

function submit(event) {
	let input = document.getElementById("input");
	let result;

	if (event == null) {
		result = getYoutubeId(input.value);
	} else {
		if (event.keyCode === 13) {
			result = getYoutubeId(input.value);
		}
	}

	if (result != null) {
		if (result[1] != '') {
			currentPlaylist = 'Use My Own';
			customUrl = input.value;
			localStorage.setItem('customUrl', customUrl);
			changePlaylist(input.value);
		}
	}
}

function changePlaylist(playlist) {
	if (player == null) return;

	const playlistData = getYoutubeId(playlist);

	// Optional, could remove and nothing changes. Put here in case YouTube wants it though.
	let loadData = {
		listType: playlistData[0] ? 'playlist' : 'user_uploads',
	};

	// This is the only thing that matters, single videos are put in list, playlists are put in playlists.
	if (playlistData[0]) {
		loadData.list = playlistData[1];
	} else {
		loadData.playlist = playlistData[1];
	}

	player.loadPlaylist(loadData);
	saveData();
}

function saveData() {
	localStorage.setItem('currentPlaylist', currentPlaylist);
	localStorage.setItem('currentIndex', currentIndex);
	localStorage.setItem('background', currentBackground);
}

function getYoutubeId(playlist) {
	let isPlaylist = false;
	let youtubeId = "";

	if (playlist.includes('list=')) {
		isPlaylist = true;
		youtubeId = playlist.substr(playlist.indexOf('list=') + 5);
	} else if (playlist.includes('watch?v=')) {
		youtubeId = playlist.substr(playlist.indexOf('watch?v=') + 8);
	} else {
		alert('Could not extract video/playlist ID from ' + playlist + ', try another value.');
	}

	return [isPlaylist, youtubeId];
}

function setLoopStatus() {
	player.setLoop(document.getElementById('loop-checkbox').checked);
}

function getLoopStatus() {
	return document.getElementById('loop-checkbox').checked;
}

// TODO: Load sounds as they are required instead of all at once.
function loadSounds() {
	const audioPath = '/static/imissmycafe/sounds/';
	let sounds = [];
	bgSounds.forEach(sound => {
		let note = {
			id: sound,
			src: sound + '.mp3'
		};
		sounds.push(note);
	});
	createjs.Sound.alternateExtensions = ['mp3'];
	createjs.Sound.on('fileload', ready);
	createjs.Sound.registerSounds(sounds, audioPath);
}

function playBackgroundAudio(background) {
	createjs.Sound.stop();
	createjs.Sound.play(background);
	createjs.Sound.loop = -1;
}

function ready(event) {
	let source = event.src;
	source = source.substr(source.lastIndexOf('/') + 1);
	source = source.substr(0, source.length - 4);

	if (currentBackground == source) {
		manageSelectedOption('background', currentBackground);
		playBackgroundAudio(currentBackground);
	}
}