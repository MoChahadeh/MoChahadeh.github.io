let obj = {
	src: ["./sounds/Grand.mp3"],
	preload: true,
	sprite: {},
	onload: function () {
		hideLoadingScreen();
		addEventListener("keydown", keyDownFunc);
		addEventListener("keyup", keyUpFunc);
	},
};

let instruments = [
	{
		name: "Grand Piano",
		src: "./sounds/Grand.mp3",
		delay: 300,
	},
	{
		name: "Erhu",
		src: "./sounds/Erhu.mp3",
		delay: 100,
	},
	{
		name: "String Ensemble",
		src: "./sounds/Strings.mp3",
		delay: 500,
	},
	{
		name: "Marimba",
		src: "./sounds/Marimba.mp3",
		delay: 300,
	},
	{
		name: "Flute Solo",
		src: "./sounds/FluteSolo.mp3",
		delay: 200,
	},
];

let instrumentIndex = 0;

function increaseOctave() {
	if (octave < 6) octave++;
	refreshOctaveText();
}

function decreaseOctave() {
	if (octave > 0) octave--;
	refreshOctaveText();
}

function refreshOctaveText() {
	document.getElementById("octaveText").innerHTML = `C${octave}`;
}

let Notedelay = 300;

const is_iOS = (() => {
	return (
		["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
			navigator.platform
		) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	);
})();

if (is_iOS) {
	obj.html5 = true;
}

let pointer = 0;
const notesArray = [
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"Gb",
	"G",
	"Ab",
	"A",
	"Bb",
	"B",
	"C1",
	"Db1",
	"D1",
	"Eb1",
	"E1",
	"F1",
];

for (let i = 0; i <= 7; i++) {
	for (let j = 0; j < 12; j++) {
		obj.sprite[`${notesArray[j]}${i}`] = [pointer, 6000];
		pointer += 7000;
	}
}

const sprite = new Howl(obj);
refreshInstrument();
let sustain = false;
let octave = 3;

let downKeys = [];
let allSoundsPlaying = [];

function keyDownFunc(ev) {
	if (ev.repeat) return;
	const key1 = getKeyClicked(ev.key);

	if (key1 !== "error") {
		playKey(key1);
	} else if (ev.key == "z") {
		decreaseOctave();
		document.getElementById("decreaseOctaveButton").classList.add("highlightedControlButton");
	} else if (ev.key == "x") {
		increaseOctave();
		document.getElementById("increaseOctaveButton").classList.add("highlightedControlButton");
	} else if (ev.key.toLowerCase() == "§") {
		sustain = true;
	} else if (ev.key.toLowerCase() == ",") {
		previousInstrument();
		document.getElementById("previousInstrumentButton").classList.add("highlightedControlButton");
	} else if (ev.key.toLowerCase() == ".") {
		nextInstrument();
		document.getElementById("nextInstrumentButton").classList.add("highlightedControlButton");
	}
};

function keyUpFunc(ev) {
	const key2 = getKeyClicked(ev.key);
	if (key2 !== "error") {
		stopKey(key2);
	} else {
		switch (ev.key.toLowerCase()) {
			case "§":
				sustain = false;
				allSoundsPlaying.map(sId => {
					if (!downKeys.some(obj => obj.soundId == sId)) {
						sprite.fade(1, 0, Notedelay, sId);
						sprite.on(
							"fade",
							() => {
								sprite.stop(sId);
								allSoundsPlaying.splice(allSoundsPlaying.indexOf(sId), 1);
							},
							sId
						);
					}
				});
				break;
			case "z":
				document
					.getElementById("decreaseOctaveButton")
					.classList.remove("highlightedControlButton");
				break;
			case "x":
				document
					.getElementById("increaseOctaveButton")
					.classList.remove("highlightedControlButton");
				break;
			case ",":
				document
					.getElementById("previousInstrumentButton")
					.classList.remove("highlightedControlButton");
				break;
			case ".":
				document
					.getElementById("nextInstrumentButton")
					.classList.remove("highlightedControlButton");
				break;
		}
	}
};

function highlightKey(key) {
	document.getElementById(key).classList.add("highlighted");
}

function deHighlightKey(key) {
	document.getElementById(key).classList.remove("highlighted");
}
function getKeyClicked(key) {
	switch (key) {
		case "a":
			return "C";
		case "s":
			return "D";
		case "d":
			return "E";
		case "f":
			return "F";
		case "g":
			return "G";
		case "h":
			return "A";
		case "j":
			return "B";
		case "k":
			return "C1";
		case "l":
			return "D1";
		case ";":
			return "E1";
		case "'":
			return "F1";
		case "w":
			return "Db";
		case "e":
			return "Eb";
		case "t":
			return "Gb";
		case "y":
			return "Ab";
		case "u":
			return "Bb";
		case "o":
			return "Db1";
		case "p":
			return "Eb1";
		default:
			return "error";
	}
}

function playKey(key1) {
	highlightKey(key1);
	const noteToPlay =
		key1[key1.length - 1] != "1"
			? key1 + `${octave}`
			: key1.slice(0, key1.length - 1) + `${octave + 1}`;

	const sound = sprite.play(noteToPlay);

	downKeys.push({ key: key1, soundId: sound });
	console.log(downKeys);
	allSoundsPlaying.push(sound);
}

function stopKey(key2) {
	const associatedObj = downKeys.find(obj => obj.key == key2);
	if (associatedObj) {
		deHighlightKey(key2);

		if (!sustain) {
			if (!is_iOS || true) {
				sprite.fade(1, 0, Notedelay, associatedObj.soundId);
				sprite.on(
					"fade",
					() => {
						sprite.stop(associatedObj.soundId);
						allSoundsPlaying.splice(allSoundsPlaying.indexOf(associatedObj.soundId), 1);
					},
					associatedObj.soundId
				);
			} else {
				setTimeout(() => {
					sprite.stop(associatedObj.soundId);
					allSoundsPlaying.splice(allSoundsPlaying.indexOf(associatedObj.soundId), 1);
				}, 50);
			}
		}
		downKeys.splice(downKeys.indexOf(associatedObj), 1);
		console.log(downKeys);
	}
}

function refreshInstrument() {
	sprite._src = instruments[instrumentIndex].src;
	Notedelay = instruments[instrumentIndex].delay;

	showLoadingScreen();
	removeEventListener("keydown", keyDownFunc);
	removeEventListener("keyup", keyUpFunc);
	sprite.load();
	if (document.getElementById("instrumentName"))
		document.getElementById("instrumentName").innerHTML = `${instruments[instrumentIndex].name}`;
}

function previousInstrument() {
	if (instrumentIndex > 0) {
		instrumentIndex--;
	} else {
		instrumentIndex = instruments.length - 1;
	}
	refreshInstrument();
}

function nextInstrument() {
	if (instrumentIndex < instruments.length - 1) {
		instrumentIndex++;
	} else {
		instrumentIndex = 0;
	}
	refreshInstrument();
}

function hideLoadingScreen() {
	document.getElementById("loadingDiv").classList.remove("loading");
	document.getElementById("loadingDiv").classList.add("noLoading");
}

function showLoadingScreen() {
	if (document.getElementById("loadingDiv")) {
		document.getElementById("loadingDiv").classList.add("loading");
		document.getElementById("loadingDiv").classList.remove("noLoading");
	}
}
