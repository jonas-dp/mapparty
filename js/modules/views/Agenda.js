import * as Journey from "../models/Journey.js";

export const tab = document.getElementById("agendaTab");
export const element = document.getElementById("agenda");

export function renderAgenda(journeyIndex){
	let activitiesHtml = "";

	Journey.getDayAgenda(journeyIndex).forEach(agendaItem => {
		activitiesHtml += createAgendaItemHtml(agendaItem);
	});

	document.getElementById("agenda").innerHTML = activitiesHtml;
}

export function createAgendaItemHtml(agendaItem){
	return `<li class="collection-item avatar">
        <i class="material-icons circle red darken-4">${agendaItem.icon}</i>
        <span class="title">${agendaItem.title}</span>
        <p>${agendaItem.info}<br/>${agendaItem.additionalInfo ? agendaItem.additionalInfo : ""}</p>
        </li>`;
}