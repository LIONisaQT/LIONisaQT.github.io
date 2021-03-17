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

var allActivities = writingActivities.concat(visualActivities).concat(musicActivities);

function generateList() {
	const daysToPopulate = 7;
	const numActivitiesInDay = 3;

	let div = document.getElementById("theme-day-parent");
	div.innerHTML = "";

	let occurrenceMap = [];
	
	for (let i = 0; i < daysToPopulate; i++)
	{
		for (let j = 0; j < numActivitiesInDay; j++) {
			let activity = getRandomActivityFromAll();
			addActivityOccurrenceToMap(occurrenceMap, activity);
			div.innerHTML += activity + ", ";
		}
		div.innerHTML += "\n\n";
	}

	plotGraph(occurrenceMap);
}

function getRandomActivityFromAll() {
	return allActivities[Math.floor(Math.random() * allActivities.length)];
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