const writingActivities = [
	"Wordplay",
	"Free Verse",
	"Comic Relief",
	"Poetry",
	"Wordsmith",
	"Write Stuff"
];

const visualActivities = [
	"Coloring",
	"Free Paint",
	"Photo Finish",
	"Shape Shift",
	"Finish Line",
	"Rough Shape",
	"Cut & Paste"
];

const musicActivities = [
	"Beat Board",
	"Composer",
	"Sound Sampler"
]

let writingPool = [...writingActivities];
let visualPool = [...visualActivities];
let musicPool = [...musicActivities];

let occurrenceMap;
let breakdownMap;

let lastXActivities = [];

const allActivities = writingActivities.concat(visualActivities).concat(musicActivities);

const ACTIVITY_DAY_CACHE_SIZE = 3;

function generate() {
	occurrenceMap = [];
	breakdownMap = initializeMap(["Writing", "Visual", "Music"]);
	generateList();
	plotGraphs(occurrenceMap, breakdownMap);
}

function generateList() {
	let daysToPopulate = getNumberFromInput("day-count");
	let numActivitiesInDay = getNumberFromInput("activity-count");

	let writingRatio = getNumberFromInput("ratio-writing");
	let visualRatio = getNumberFromInput("ratio-visual");
	let musicRatio = getNumberFromInput("ratio-music");

	if (writingRatio + visualRatio + musicRatio != 100) {
		alert("Ratio is greater than 100! Please make sure sum of ratios equals 100");
		return;
	}

	let maxActivities = daysToPopulate * numActivitiesInDay;
	let maxWriting = Math.floor(writingRatio * maxActivities / 100);
	let maxVisual = Math.floor(visualRatio * maxActivities / 100);
	let maxMusic = Math.floor(musicRatio * maxActivities / 100);

	let div = document.getElementById("theme-day-parent");
	div.innerHTML = "";

	for (let i = 0; i < daysToPopulate; i++) {
		console.log("===== DAY " + (i + 1) + " =====");

		for (let j = 0; j < numActivitiesInDay; j++) {
			let category;
			let categoryName;
			let categoryMax;

			// Get random activity from chosen pool.
			let activity = null;
			while (activity == null) {
				// Select which activity pool we're drawing from.
				let rand = Math.floor(Math.random() * 100);
				if (rand < writingRatio) {
					categoryName = "Writing";
					category = writingPool;
					categoryMax = maxWriting;
				} else if (rand < writingRatio + visualRatio) {
					categoryName = "Visual";
					category = visualPool;
					categoryMax = maxVisual;
				} else {
					categoryName = "Music";
					category = musicPool;
					categoryMax = maxMusic;
				}

				console.log(rand + ": Picking from " + categoryName);
				activity = getRandomActivityFromPool(category, categoryName, categoryMax, breakdownMap);

				if (category.length <= 0) {
					refillPool(categoryName);
				}

				if (activity != null) {
					lastXActivities.push(activity);

					if (lastXActivities.length > ACTIVITY_DAY_CACHE_SIZE * numActivitiesInDay) {
						lastXActivities.shift();
					}
				}
			}

			console.log("	> Picked " + activity);

			if (writingPool.length <= 0) {
				refillPool("Writing");
			}
			if (visualPool.length <= 0) {
				refillPool("Visual");
			}
			if (musicPool.length <= 0) {
				refillPool("Music");
			}

			addKeyValuePairToMap(occurrenceMap, activity);
			addKeyValuePairToMap(breakdownMap, categoryName);
			div.innerHTML += activity + ", ";
		}
		div.innerHTML += "\n\n";
	}
}

function getNumberFromInput(id) {
	let inputDiv = document.getElementById(id);
	let number = inputDiv.value == "" ? inputDiv.getAttribute("placeholder") : inputDiv.value;
	return parseInt(number);
}

function getRandomActivityFromPool(activityPool, categoryName, categoryMax, breakdownMap) {
	if (activityPool.length <= 0) {
		return null;
	}

	let activity = activityPool[Math.floor(Math.random() * activityPool.length)];
	let index = activityPool.indexOf(activity);
	activityPool.splice(index, 1);

	lastXActivities.forEach(element => {
		if (element == activity) {
			console.warn(activity + " was found in the last " + ACTIVITY_DAY_CACHE_SIZE + " days!");
			activity = null;
		}
	});

	return activity;
}

function refillPool(category) {
	let pool;

	switch (category) {
		case "Writing":
			writingPool = [...writingActivities];
			pool = writingPool;
			break;
		case "Visual":
			visualPool = [...visualActivities];
			pool = visualPool;
			break;
		case "Music":
			musicPool = [...musicActivities];
			pool = musicPool;
			break;
		default:
			console.warn("refillPool called without arg!");
			break;
	}

	return pool;
}

function initializeMap(keys) {
	let map = [];
	keys.forEach(key => map[key] = 0);
	return map;
}

function addKeyValuePairToMap(map, key) {
	if (map[key] == null) {
		map[key] = 1;
	} else {
		map[key]++;
	}
}

function plotGraphs(rawCountMap, breakdownMap) {
	plotRawCount(rawCountMap);
	plotBreakdown(breakdownMap);
}

function plotRawCount(rawCountMap) {
	let rawCountGraph = document.getElementById("raw-count-graph");

	let y = [];
	allActivities.forEach(activity => y.push(rawCountMap[activity]));

	let data = [{
		x: allActivities,
		y: y,
		type: "bar"
	}]

	let layout = {
		margin: {
			t: 0
		}
	}

	Plotly.newPlot(rawCountGraph, data, layout);
}

function plotBreakdown(breakdownMap) {
	let breakdownChart = document.getElementById("breakdown-chart");

	let data = [{
		values: [breakdownMap["Writing"], breakdownMap["Visual"], breakdownMap["Music"]],
		labels: ["Writing", "Visual", "Music"],
		type: "pie"
	}]

	let layout = {
		height: 400,
		width: 500
	};

	Plotly.newPlot(breakdownChart, data, layout);
}