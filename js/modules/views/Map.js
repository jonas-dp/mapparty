import * as Journey from '../models/Journey.js';
import * as Agenda from  './Agenda.js';
import {mapboxToken} from '../Config.js';

let map;
let currentLayer;

export const tab = document.getElementById("mapTab");
export const element = document.getElementById("map");

export function init() {
    map = L.map("map").setView([0, 0], 2);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxToken, {
        id: 'mapbox.outdoors',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);
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
            html: `<a class="btn-floating btn-small red darken-4"><i class="material-icons">${agendaItem.icon}</i></a>`,
            className: 'youHaveNoClass'
        })
    }).bindPopup(`<ul class="collection with-header">${Agenda.createAgendaItemHtml(agendaItem)}</ul>`);
}

function createLineString(agendaItem) {
    return L.polyline(agendaItem.geodata.coordinates)
        .bindPopup(`<ul class="collection with-header">${Agenda.createAgendaItemHtml(agendaItem)}</ul>`);
}