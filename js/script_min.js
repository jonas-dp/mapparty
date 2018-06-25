"use strict";var map,current_day_index=0,currentMapLayer,journeyData,VIEW={MAP:Symbol("MAP"),AGENDA:Symbol("AGENDA")};function init(){initMap(),setNavBarText("Even geduld..."),initFirebaseDB(function(a){journeyData=a.val().data,startApp()},function(a){console.log(a),setNavBarText("Error"),alert("Kon gegevens niet ophalen. Probeer later opnieuw.")})}function initMap(){map=L.map("map").setView([0,0],2),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9uYXNkZXBlbHNtYWVrZXIiLCJhIjoiY2l3ZzhjdWp2MDAwNzJvcDR6ZnV1dzZ5dyJ9.xg8kjdAbigT1T4ZA_8P57w",{id:"mapbox.outdoors",attribution:"Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>"}).addTo(map)}function initFirebaseDB(a,b){var c=firebase.database();c.ref("/").on("value",a,b)}function startApp(){var a=new Date,b=a.getFullYear()+"-"+("0"+(a.getMonth()+1)).slice(-2)+"-"+("0"+a.getDate()).slice(-2),c=journeyData.findIndex(function(d){return d.date===b});0>c&&(c=0),current_day_index=c,renderPage(current_day_index),switchViewTo(VIEW.MAP)}function renderPage(a){setLayersOnMap(),renderAgenda(a),setNavBarText(new Date(journeyData[a].date).toLocaleDateString("nl-BE",{day:"numeric",month:"long"}))}function switchViewTo(a){var b=document.getElementById("map"),c=document.getElementById("agenda");a===VIEW.MAP?(b.style.display="block",c.style.display="none",setLayersOnMap()):a===VIEW.AGENDA?(b.style.display="none",c.style.display="block"):void 0}function renderAgenda(a){var b="";journeyData[a].agenda.forEach(function(c){b+=createAgendaItem(c)}),document.getElementById("agenda").innerHTML=b}function createAgendaItem(a){return"<li class=\"collection-item avatar\">\n        <i class=\"material-icons circle red darken-4\">"+a.icon+"</i>\n        <span class=\"title\">"+a.title+"</span>\n        <p>"+a.info+"<br/>"+(a.additionalInfo?a.additionalInfo:"")+"</p>\n        </li>"}function setNavBarText(a){document.getElementById("day").textContent=a}function onMapTabClick(){switchViewTo(VIEW.MAP)}function onAgendaTabClick(){switchViewTo(VIEW.AGENDA)}function onPrevBtnClick(){0>--current_day_index&&(current_day_index=journeyData.length-1),renderPage(current_day_index)}function onNextBtnClick(){++current_day_index>journeyData.length-1&&(current_day_index=0),renderPage(current_day_index)}function setLayersOnMap(){currentMapLayer&&map.removeLayer(currentMapLayer);var a=journeyData[current_day_index].agenda;currentMapLayer=new L.featureGroup,a.forEach(function(b){b.geodata&&currentMapLayer.addLayer(createMapLayer(b))}),currentMapLayer.addTo(map),map.fitBounds(currentMapLayer.getBounds().pad(0.1))}function createMapLayer(a){switch(a.geodata.type){case"Point":return createMarker(a);case"LineString":return createLineStringLayer(a);}}function createMarker(a){return L.marker(a.geodata.coordinates,{icon:L.divIcon({html:"<a class=\"btn-floating btn-small red darken-4\"><i class=\"material-icons\">"+a.icon+"</i></a>",className:"youHaveNoClass"})}).bindPopup("<ul class=\"collection with-header\">"+createAgendaItem(a)+"</ul>")}function createLineStringLayer(a){return L.polyline(a.geodata.coordinates).bindPopup("<ul class=\"collection with-header\">"+createAgendaItem(a)+"</ul>")}