import * as Map from "./Map.js";
import * as Agenda from "./Agenda.js";
import * as Journey from "../models/Journey.js";

let currentDayIndex;

const VIEW = {
	MAP: Symbol("MAP"),
	AGENDA: Symbol("AGENDA"),
	PHOTOS: Symbol("PHOTOS")
};

export function init(){
	attachEventHandlers();
	setCurrentDayIndex();
	hideBusyIndicator();
	displayNavBar();
	Map.init();
	displayDay();
}

export function setNavBarText(string) {
	document.getElementById("day").textContent = string;
}

function setCurrentDayIndex(){
	let now = new Date();
	let today = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(-2)}-${("0" + now.getDate()).slice(-2)}`;

	let index = Journey.findIndexByDate(today);
	if (index < 0) {
		index = 0;
	}
	currentDayIndex = index;
}

function hideBusyIndicator(){
	document.getElementById("busyIndicator").style.display = "none";
}

function displayNavBar(){
	document.getElementById("navbar").style.display = "block";
}

function displayDay(){
	Agenda.renderAgenda(currentDayIndex);
	Map.placeObjects(currentDayIndex);
	setNavBarText(Journey.getDayDate(currentDayIndex).toLocaleDateString("nl-BE", { day: "numeric", month: "long" }));
}

function switchViewTo(view){
	switch (view) {
	case VIEW.MAP:
		Map.element.style.display = "block";
		Agenda.element.style.display = "none";
		break;
	case VIEW.AGENDA:
		Map.element.style.display = "none";
		Agenda.element.style.display = "block";
		break;
	}
}

function attachEventHandlers(){
	Map.tab.onclick = function(){
		switchViewTo(VIEW.MAP);
	};

	Agenda.tab.onclick = function(){
		switchViewTo(VIEW.AGENDA);
	};

	document.getElementById("prev").onclick = function(){
		if (--currentDayIndex < 0) {
			currentDayIndex = Journey.getNumberOfDays() - 1;
		}
		displayDay();
	};

	document.getElementById("next").onclick = function(){
		if (++currentDayIndex > Journey.getNumberOfDays() - 1) {
			currentDayIndex = 0;
		}
		displayDay();
	};
}