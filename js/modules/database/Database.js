import {firebaseConfig} from "../Config.js";

function init(onSuccess, onError){
	firebase.database().ref("/").on("value", onSuccess, onError);
}

export function getData(onSuccess, onError){
	firebase.initializeApp(firebaseConfig);
	init(onSuccess, onError);
}