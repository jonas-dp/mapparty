import * as DB from "./modules/database/Database.js";
//import * as MockDB from "./modules/database/MockDB.js";
import * as Shell from "./modules/views/Shell.js";
import * as Journey from "./modules/models/Journey.js";

DB.getData(function (data) {
	Journey.setData(data.val().data);
	Shell.init();
}, function (error) {
	console.log(error);
	Shell.setNavBarText("Error");
	alert("Kon gegevens niet ophalen. Probeer later opnieuw.");
});