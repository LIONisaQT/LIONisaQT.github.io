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

const allActivities = writingActivities.concat(visualActivities).concat(musicActivities);

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

	let writingPool = [...writingActivities];
	let visualPool = [...visualActivities];
	let musicPool = [...musicActivities];

	let div = document.getElementById("theme-day-parent");
	div.innerHTML = "";

	let occurrenceMap = [];

	let breakdownMap = initializeMap(["Writing", "Visual", "Music"]);

	for (let i = 0; i < daysToPopulate; i++) {
		console.log("===== DAY " + (i + 1) + " =====");
		for (let j = 0; j < numActivitiesInDay; j++) {
			let category;
			let categoryName;
			let categoryMax;

			// Get random activity from chosen pool.
			let activity = null;
			while (activity == null) {
				// Select which activity pool we're drawing form.
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
			}

			console.log("	> Picked " + activity);

			if (writingPool.length <= 0 && breakdownMap["Writing"] < maxWriting) {
				writingPool = [...writingActivities];
			}
			if (visualPool.length <= 0 && breakdownMap["Visual"] < maxVisual) {
				visualPool = [...visualActivities];
			}
			if (musicPool.length <= 0 && breakdownMap["Music"] < maxMusic) {
				musicPool = [...musicActivities];
			}

			addKeyValuePairToMap(occurrenceMap, activity);
			addKeyValuePairToMap(breakdownMap, categoryName);
			div.innerHTML += activity + ", ";
		}
		div.innerHTML += "\n\n";
	}

	plotGraphs(occurrenceMap, breakdownMap);
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

	// No idea why it hangs up if this is a >= operation.
	if (breakdownMap[categoryName] > categoryMax) {
		return null;
	}

	let activity = activityPool[Math.floor(Math.random() * activityPool.length)];
	let index = activityPool.indexOf(activity);
	activityPool.splice(index, 1);
	return activity;
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

	let config = {
		staticPlot: true
	}

	Plotly.newPlot(rawCountGraph, data, layout, config);
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