import * as Journey from "../models/Journey.js";

export const tab = document.getElementById("agendaTab");
export const element = document.getElementById("agenda");

export function renderAgenda(journeyIndex){
	let activitiesHtml = "";

	Journey.getDayAgenda(journeyIndex).forEach(feature => {
		activitiesHtml += createAgendaItemHtml(feature.properties);
	});

	document.getElementById("agenda").innerHTML = activitiesHtml;
}

export function createAgendaItemHtml(featureProperties){
	return `<li class="collection-item avatar">
        <i class="material-icons circle blue darken-3">${featureProperties.icon}</i>
        <span class="title">${featureProperties.title}</span>
        <p>${featureProperties.info}<br/>${featureProperties.additionalInfo ? featureProperties.additionalInfo : ""}</p>
        </li>`;
}