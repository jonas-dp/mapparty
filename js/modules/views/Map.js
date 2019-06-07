import * as Journey from "../models/Journey.js";
import * as Agenda from  "./Agenda.js";
import {mapboxToken} from "../Config.js";

let map;
let currentLayer;
let mapboxUrl = `https://api.mapbox.com/styles/v1/{style}/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
let mapboxAttribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>";

export const tab = document.getElementById("mapTab");
export const element = document.getElementById("map");

export function init() {
	if(map){
		//if map is already initialized, destroy it
		map.off();
		map.remove();
	}

	let layers = createLayers();

	map = L.map("map", {
		layers: [layers.Kaart, layers.Satteliet]
	}).setView([0, 0], 2);

	L.control.layers(layers).addTo(map);
}

export function placeObjects(journeyIndex){
	if(currentLayer){
		map.removeLayer(currentLayer);
	}

	currentLayer = new L.featureGroup();

	Journey.getDayAgenda(journeyIndex).forEach(agendaItem => {
		if(agendaItem.geodata){
			currentLayer.addLayer(createMapObject(agendaItem));
		}
	});

	currentLayer.addTo(map);
	map.fitBounds(currentLayer.getBounds().pad(0.1));
}

function createMapObject(agendaItem){
	switch(agendaItem.geodata.type){
	case "Point":
		return createMarker(agendaItem);
	case "LineString":
		return createLineString(agendaItem);
	}
}

function createMarker(agendaItem){
	return L.marker(agendaItem.geodata.coordinates, {
		icon: L.divIcon({
			html: `<a class="btn-floating btn-small blue darken-3"><i class="material-icons">${agendaItem.icon}</i></a>`,
			className: "youHaveNoClass"
		})
	}).bindPopup(`<ul class="collection with-header">${Agenda.createAgendaItemHtml(agendaItem)}</ul>`);
}

function createLineString(agendaItem) {
	return L.polyline(agendaItem.geodata.coordinates)
		.bindPopup(`<ul class="collection with-header">${Agenda.createAgendaItemHtml(agendaItem)}</ul>`);
}

function createLayers(){
	let outdoorLayer = L.tileLayer(mapboxUrl, {
		style: "mapbox/outdoors-v11",
		attribution: mapboxAttribution
	});
	let satteliteLayer = L.tileLayer(mapboxUrl, {
		style: "mapbox/satellite-v9",
		attribution: mapboxAttribution
	});

	return {"Satteliet": satteliteLayer, "Kaart": outdoorLayer};
}