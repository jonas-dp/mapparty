let map;
let current_day_index = 0;
let currentMapLayer;
let journeyData;

const VIEW = {
    MAP: Symbol("MAP"),
    AGENDA: Symbol("AGENDA"),
    PHOTOS: Symbol("PHOTOS")
}

function init() {
    initMap();
    setNavBarText("Even geduld...");
    initFirebaseDB(function (response) {
        journeyData = response.val().data;
        startApp();
    }, function (error) {
        console.log(error);
        setNavBarText("Error");
        alert("Kon gegevens niet ophalen. Probeer later opnieuw.");
    });
}

function initMap() {
    map = L.map("map").setView([0, 0], 2);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9uYXNkZXBlbHNtYWVrZXIiLCJhIjoiY2l3ZzhjdWp2MDAwNzJvcDR6ZnV1dzZ5dyJ9.xg8kjdAbigT1T4ZA_8P57w', {
        id: 'mapbox.outdoors',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);
};

function initFirebaseDB(successCallback, errorCallback) {
    let db = firebase.database();
    db.ref("/").on("value", successCallback, errorCallback);
}

function startApp() {
    //check if current date is in journey data
    let now = new Date();
    let today = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`

    let index = journeyData.findIndex(day => day.date === today);
    if (index < 0) {
        index = 0;
    }

    current_day_index = index;

    renderPage(current_day_index);
    switchViewTo(VIEW.MAP)
}

function renderPage(index) {
    setLayersOnMap();
    renderAgenda(index);
    setNavBarText((new Date(journeyData[index].date)).toLocaleDateString("nl-BE", { day: "numeric", month: "long" }));
}

function switchViewTo(view) {
    let map = document.getElementById("map");
    let agenda = document.getElementById("agenda");
    let photos = document.getElementById("photos");

    switch (view) {
        case VIEW.MAP:
            map.style.display = "block";
            agenda.style.display = "none";
            photos.style.display = "none";
            setLayersOnMap();
            break;
        case VIEW.AGENDA:
            map.style.display = "none";
            agenda.style.display = "block";
            photos.style.display = "none";
            break;
        case VIEW.PHOTOS:
            map.style.display = "none";
            agenda.style.display = "none";
            photos.style.display = "block";
            break;
    }
}

function renderAgenda(index) {
    let activitiesHtml = "";

    journeyData[index].agenda.forEach(agendaItem => {
        activitiesHtml += createAgendaItem(agendaItem);
    });

    document.getElementById("agenda").innerHTML = activitiesHtml;
}

function createAgendaItem(agendaItem) {
        return `<li class="collection-item avatar">
        <i class="material-icons circle red darken-4">${agendaItem.icon}</i>
        <span class="title">${agendaItem.title}</span>
        <p>${agendaItem.info}<br/>${agendaItem.additionalInfo ? agendaItem.additionalInfo : ""}</p>
        </li>`;
}

function setNavBarText(string) {
    document.getElementById("day").textContent = string;
}

function onMapTabClick() {
    switchViewTo(VIEW.MAP);
}

function onAgendaTabClick() {
    switchViewTo(VIEW.AGENDA);
}

function onPhotosTabClick() {
    switchViewTo(VIEW.PHOTOS);
}

function onPrevBtnClick() {
    if (--current_day_index < 0) {
        current_day_index = journeyData.length - 1;
    }
    renderPage(current_day_index);
}

function onNextBtnClick() {
    if (++current_day_index > journeyData.length - 1) {
        current_day_index = 0;
    }
    renderPage(current_day_index);
}

function setLayersOnMap() {
    if(currentMapLayer){
        map.removeLayer(currentMapLayer)
    };

    let agenda = journeyData[current_day_index].agenda;
    currentMapLayer = new L.featureGroup();

    agenda.forEach(agendaItem => {
        if(agendaItem.geodata){
            currentMapLayer.addLayer(createMapLayer(agendaItem));
        }
    });

    currentMapLayer.addTo(map);
    map.fitBounds(currentMapLayer.getBounds().pad(0.1));
}

function createMapLayer(agendaItem) {
    switch (agendaItem.geodata.type) {
        case "Point":
            return createMarker(agendaItem);
        case "LineString":
            return createLineStringLayer(agendaItem);
    }
}

function createMarker(agendaItem) {
    return L.marker(agendaItem.geodata.coordinates, {
        icon: L.divIcon({
            html: `<a class="btn-floating btn-small red darken-4"><i class="material-icons">${agendaItem.icon}</i></a>`,
            className: 'youHaveNoClass'
        })
    }).bindPopup(`<ul class="collection with-header">${createAgendaItem(agendaItem)}</ul>`);
}

function createLineStringLayer(agendaItem) {
    return L.polyline(agendaItem.geodata.coordinates)
        .bindPopup(`<ul class="collection with-header">${createAgendaItem(agendaItem)}</ul>`);
}