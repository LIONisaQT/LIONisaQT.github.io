const writingActivities = [
	"Wordplay",
	"Free Verse",
	"Comic Relief",
	"Poetry",
	"Wordsmith",
	"Creative Writing"
];

const visualActivities = [
	"Coloring",
	"Free Paint",
	"Photo Finish",
	"Shape Shift",
	"Finish Line",
	"Rough Shape",
	"Shape Shift Menu"
];

const musicActivities = [
	"Beat Board",
	"Composer"
]

const allActivities = writingActivities.concat(visualActivities).concat(musicActivities);

function generateList() {
	let daysToPopulate = getDayCount();
	let numActivitiesInDay = getActivityCount();

	let div = document.getElementById("theme-day-parent");
	div.innerHTML = "";

	let occurrenceMap = [];
	let activityPool = [...allActivities];
	
	for (let i = 0; i < daysToPopulate; i++)
	{
		for (let j = 0; j < numActivitiesInDay; j++) {
			let activity = getRandomActivityFromPool(activityPool);
			if (activityPool.length <= 0) {
				activityPool = [...allActivities];
			}
			addActivityOccurrenceToMap(occurrenceMap, activity);
			div.innerHTML += activity + ", ";
		}
		div.innerHTML += "\n\n";
	}

	plotGraph(occurrenceMap);
}

function getDayCount() {
	let dayCount = document.getElementById("day-count");
	return dayCount.value == "" ? dayCount.getAttribute("placeholder") : dayCount.value; 
}

function getActivityCount() {
	let activityCount = document.getElementById("activity-count");
	return activityCount.value == "" ? activityCount.getAttribute("placeholder") : activityCount.value; 
}

function getRandomActivityFromPool(activityPool) {
	let activity = activityPool[Math.floor(Math.random() * activityPool.length)];
	let index = activityPool.indexOf(activity);
	activityPool.splice(index, 1);
	return activity;
}

function addActivityOccurrenceToMap(map, activity)
{
	if (map[activity] == null) {
		map[activity] = 1;
	} else {
		map[activity]++;
	}
}

function plotGraph(map) {
	let rawCountGraph = document.getElementById("raw-count-graph");

	let y = [];
	allActivities.forEach(activity => y.push(map[activity]));

	let trace = {
		x: allActivities,
		y: y,
		type: 'bar'
	}

	let data = [trace];

	let layout = {
		margin: {
			t: 0
		}
	}

	let config = {
		staticPlot: true
	}
	
	Plotly.newPlot( rawCountGraph, data, layout, config );
}