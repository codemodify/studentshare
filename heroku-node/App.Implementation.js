App = {};
App.HouseKeeping = {};

App.Db = null;
App.HouseKeeping.AppInstance = null;

App.HouseKeeping.OnDbConnect = function () {
	App.DataModels.Configure();
	App.HouseKeeping.AppInstance.listen(process.env.PORT);
    //App.HouseKeeping.AppInstance.listen("8080");
}

App.HouseKeeping.SendResponseToClient = function (response, data) {
	response.writeHead(200, {"Content-Type": "application/json"});
	response.write(JSON.stringify(data));
	response.end();    
}

App.Configure = function () {
	var express = require("express");

	App.HouseKeeping.AppInstance = express();
    //////////App.HouseKeeping.AppInstance.use(express.static(path.join(__dirname, 'client')));    
}

App.DefineRoute = function (route, delegate) {
	App.HouseKeeping.AppInstance.get(
		route,
		function (request, response) {
			delegate(request.params, response, App.HouseKeeping.SendResponseToClient);
		}
	);
}

App.Run = function () {
	App.Db = require("mongoose");
	App.Db.connection.on("error", console.error.bind(console, "DB-Error: "));
	App.Db.connection.once("open", App.HouseKeeping.OnDbConnect);
    App.Db.connect("mongodb://xxx");
	//App.Db.connect("mongodb://127.0.0.1:9090/mum-student-share");
}
