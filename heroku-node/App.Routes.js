
App.Routes = {};
App.Routes.Persister = {};

App.Routes.Persister.RegisterUser = function (params, response, responseDelegate) {

    App.DataModels.User.find( {Name: params.Name },
		function (err, users) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, null);
		    }
		    else {
		        var user = null;

		        if (users.length > 0) {
		            responseDelegate(response, "exists");
		        }
		        else {
                    var guid = require("node-uuid");

                    var user = new App.DataModels.User();
		                user.Id = guid.v4();
		                user.Name = params.Name;
		                user.Pass = params.Pass;
		                user.save( 
                            function(err, users) {
				                if (err) {
					                console.log(err);
					                responseDelegate(response, "");
				                }
				                else {
                                    App.Routes.Persister.UpdateDeviceWithUserId(params.DeviceRegistrationId, user.Id);
					                responseDelegate(response, user.Id);
				                }
			                }
		                );
		        }
		    }
		}
	);
}
App.Routes.Persister.LoginUser = function (params, response, responseDelegate) {

	App.DataModels.User.find({
            Name: params.Name, 
            Pass: params.Pass
        },
		function (err, users) {
			if (err) {
				console.log( err );
				responseDelegate (response, null);
			}
			else {
			    var user = null;

                if (users.length > 0) {
                    user = users[0];
                    App.Routes.Persister.UpdateDeviceWithUserId(params.DeviceRegistrationId, user.Id);
                }
                responseDelegate(response, user);
			}
		}
	);
}
App.Routes.Persister.UpdateUserProfile = function (params, response, responseDelegate) {

	App.DataModels.User.findOne({ Id: params.UserId }, function (err, doc) {

		if (err) {
		    console.log(err);
		    responseDelegate(response, false);
		}
		else {
		    doc.Email = params.Email;
		    doc.save();
		    responseDelegate(response, true);
		}
	});
}

App.Routes.Persister.ChatSendMessage = function (params, response, responseDelegate) {

    // params.UserId
    // params.Message

	App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
			if (err) {
				console.log(err);
				responseDelegate(response, "");
			}
			else {
                if (users.length > 0) {
                    
                    var guid = require("node-uuid");

                    var chat            = new App.DataModels.Chat();
                        chat.Id         = guid.v4();
                        chat.OwnerId    = params.UserId;
                        chat.Message    = new Buffer(params.Message, "base64").toString("ascii");
                        chat.When       = new Date();
                        chat.save(
                            function(err, questions) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, "");
                                }
                                else {
                                    App.Gcm.Send(users[0].Name, chat.Message, "chat");
                                    responseDelegate(response, "");
                                }
                            }
                        );
                }
                else {
                    responseDelegate(response, "");
                }
			}
		}
	);
}
App.Routes.Persister.ChatGetMessages = function (params, response, responseDelegate) {

    // params.UserId
    // params.LastMessageId

    //Blah.find({}).sort({ date: -1 }).execFind(function (err, docs) {

    //});

    //App.DataModels.Chat.find( {},
    App.DataModels.Chat.find({}).sort({ date: -1 }).execFind(
        function (err, chatMessages) {
            if (err) {
                console.log( err );
                responseDelegate( response, [] );
            }
            else {
                App.DataModels.User.find({},
                    function (err, users) {
                        var map = {};
                        for (var i = 0; i < users.length; i++) {
                            map[users[i].Id] = users[i].Name;
                        }

                        for (var j = 0; j < chatMessages.length; j++) {
                            chatMessages[j].OwnerId = map[chatMessages[j].OwnerId];
                            chatMessages[j].When = "" +
                                chatMessages[j].When.getFullYear() + "/" +
                                (chatMessages[j].When.getMonth() + 1) + "/" +
                                chatMessages[j].When.getDate() + " " +
                                chatMessages[j].When.getHours() + ":" + chatMessages[j].When.getMinutes() + ":" + chatMessages[j].When.getSeconds();
                        }

                        responseDelegate(response, chatMessages);
                    }
                );
            }
        }
    );
}

App.Routes.Persister.AddSell = function (params, response, responseDelegate) {

	App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
			if (err) {
				console.log( err );
				responseDelegate( response, "" );
			}
			else {
                if (users.length > 0) {
                    
                    var guid = require("node-uuid");
                    
                    var sell            = new App.DataModels.Sell();
                        sell.Id         = guid.v4();
                        sell.OwnerId    = params.UserId;
                        sell.Type       = new Buffer(params.Type, "base64").toString("ascii").toLowerCase();
                        sell.Phone      = new Buffer(params.Phone       , "base64").toString("ascii");
                        sell.Email      = new Buffer(params.Email       , "base64").toString("ascii");
                        sell.Description= new Buffer(params.Description , "base64").toString("ascii");
                        sell.Price      = new Buffer(params.Price       , "base64").toString("ascii");
                        sell.WantCount  = 0;
                        sell.save(
                            function(err, sells) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, "");
                                }
                                else {
                                    responseDelegate(response, sell.Id);
                                }
                            }
                        );
                }
                else {
                    responseDelegate( response, "" );
                }
			}
		}
	);
}
App.Routes.Persister.AddSearch = function (params, response, responseDelegate) {

	App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
			if (err) {
				console.log( err );
				responseDelegate( response, "" );
			}
			else {
                if (users.length > 0) {
                    
                    var guid = require("node-uuid");
                    
                    var search              = new App.DataModels.Search();
                        search.Id           = guid.v4();
                        search.OwnerId      = params.UserId;
                        search.Type         = new Buffer(params.Type        , "base64").toString("ascii").toLowerCase();
                        search.Phone        = new Buffer(params.Phone       , "base64").toString("ascii");
                        search.Email        = new Buffer(params.Email       , "base64").toString("ascii");
                        search.Description  = new Buffer(params.Description , "base64").toString("ascii");
                        search.Price        = new Buffer(params.Price       , "base64").toString("ascii");
                        search.WantCount    = 0;
                        search.save(
                            function(err, searches) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, "");
                                }
                                else {
                                    responseDelegate(response, search.Id);
                                }
                            }
                        );
                }
                else {
                    responseDelegate( response, "" );
                }
			}
		}
	);
}
App.Routes.Persister.AddBorrow = function (params, response, responseDelegate) {

	App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
			if (err) {
				console.log( err );
				responseDelegate( response, "" );
			}
			else {
                if (users.length > 0) {
                    
                    var guid = require("node-uuid");
                    
                    var borrow              = new App.DataModels.Borrow();
                        borrow.Id           = guid.v4();
                        borrow.OwnerId      = params.UserId;
                        borrow.Type         = new Buffer(params.Type        , "base64").toString("ascii").toLowerCase();
                        borrow.Phone        = new Buffer(params.Phone       , "base64").toString("ascii");
                        borrow.Email        = new Buffer(params.Email       , "base64").toString("ascii");
                        borrow.Description  = new Buffer(params.Description , "base64").toString("ascii");
                        borrow.Price        = new Buffer(params.Price       , "base64").toString("ascii");
                        borrow.WantCount    = 0;
                        borrow.save(
                            function(err, borrows) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, "");
                                }
                                else {
                                    responseDelegate(response, borrow.Id);
                                }
                            }
                        );
                }
                else {
                    responseDelegate( response, "" );
                }
			}
		}
	);
}

App.Routes.Persister.RemoveBorrow = function (params, response, responseDelegate) {

    App.DataModels.Borrow.remove({ "Id": params.ItemId, "OwnerId": params.OwnerId }, true);

    responseDelegate(response, []);
}
App.Routes.Persister.RemoveSell = function (params, response, responseDelegate) {

    App.DataModels.Sell.remove({ "Id": params.ItemId, "OwnerId": params.OwnerId }, true);

    responseDelegate(response, []);
}
App.Routes.Persister.RemoveSearch = function (params, response, responseDelegate) {

    App.DataModels.Search.remove({ "Id": params.ItemId, "OwnerId": params.OwnerId }, true);

    responseDelegate(response, []);
}

App.Routes.Persister.LoadSell = function (params, response, responseDelegate) {
	//////App.DataModels.User.find({
    //////        Id: params.UserId
    //////    },
	//////	function (err, users) {
	//////		if (err) {
	//////			console.log( err );
	//////			responseDelegate( response, [] );
	//////		}
	//////		else {
    //////            if (users.length > 0) {
                    App.DataModels.Sell.find( {},
                        function (err, sells) {
                            if (err) {
                                console.log( err );
                                responseDelegate( response, [] );
                            }
                            else {

                                App.DataModels.SellWant.find({},
                                    function (err, sellWants) {
                                        if (err) {
                                            console.log(err);
                                            responseDelegate(response, []);
                                        }
                                        else {
                                            var map = {};
                                            for (var i = 0; i < sellWants.length; i++) {

                                                if (map[sellWants[i].ItemId] === undefined)
                                                    map[sellWants[i].ItemId] = 1;
                                                else
                                                    map[sellWants[i].ItemId] = map[sellWants[i].ItemId] + 1;
                                            }

                                            for (var j = 0; j < sells.length; j++) {
                                                if (map[sells[j].Id] !== undefined) {
                                                    sells[j].WantCount = map[sells[j].Id];
                                                }
                                            }

                                            responseDelegate(response, sells);
                                        }
                                    }
                                );
                            }
                        }
                    );
    //////            }
    //////            else {
    //////                responseDelegate( response, [] );
    //////            }				
	//////		}
	//////	}
	//////);
}
App.Routes.Persister.LoadSearch = function (params, response, responseDelegate) {
	//////App.DataModels.User.find({
    //////        Id: params.UserId
    //////    },
	//////	function (err, users) {
	//////		if (err) {
	//////			console.log( err );
	//////			responseDelegate( response, [] );
	//////		}
	//////		else {
    //////            if (users.length > 0) {
                    App.DataModels.Search.find( {},
                        function (err, searches) {
                            if (err) {
                                console.log( err );
                                responseDelegate( response, [] );
                            }
                            else {
                                App.DataModels.SearchWant.find({},
                                    function (err, searchesWants) {
                                        if (err) {
                                            console.log(err);
                                            responseDelegate(response, []);
                                        }
                                        else {
                                            var map = {};
                                            for (var i = 0; i < searchesWants.length; i++) {

                                                if (map[searchesWants[i].ItemId] === undefined)
                                                    map[searchesWants[i].ItemId] = 1;
                                                else
                                                    map[searchesWants[i].ItemId] = map[searchesWants[i].ItemId] + 1;
                                            }

                                            for (var j = 0; j < searches.length; j++) {
                                                if (map[searches[j].Id] !== undefined) {
                                                    searches[j].WantCount = map[searches[j].Id];
                                                }
                                            }

                                            responseDelegate(response, searches);
                                        }
                                    }
                                );
                            }
                        }
                    );
    //////            }
    //////            else {
    //////                responseDelegate( response, [] );
    //////            }
	//////		}
	//////	}
	//////);
}
App.Routes.Persister.LoadBorrow = function (params, response, responseDelegate) {
	//////App.DataModels.User.find({
    //////        Id: params.UserId
    //////    },
	//////	function (err, users) {
	//////		if (err) {
	//////			console.log( err );
	//////			responseDelegate( response, [] );
	//////		}
	//////		else {
    //////            if (users.length > 0) {
                    App.DataModels.Borrow.find( {},
                        function (err, borrows) {
                            if (err) {
                                console.log( err );
                                responseDelegate( response, [] );
                            }
                            else {
                                App.DataModels.BorrowWant.find({},
                                    function (err, borrowsWants) {
                                        if (err) {
                                            console.log(err);
                                            responseDelegate(response, []);
                                        }
                                        else {
                                            var map = {};
                                            for (var i = 0; i < borrowsWants.length; i++) {

                                                if (map[borrowsWants[i].ItemId] === undefined)
                                                    map[borrowsWants[i].ItemId] = 1;
                                                else
                                                    map[borrowsWants[i].ItemId] = map[borrowsWants[i].ItemId] + 1;
                                            }

                                            for (var j = 0; j < borrows.length; j++) {
                                                if (map[borrows[j].Id] !== undefined) {
                                                    borrows[j].WantCount = map[borrows[j].Id];
                                                }
                                            }

                                            responseDelegate(response, borrows);
                                        }
                                    }
                                );
                                ////////responseDelegate( response, borrows );
                            }
                        }
                    );
    //////            }
    //////            else {
    //////                responseDelegate( response, [] );
    //////            }
	//////		}
	//////	}
	//////);
}

App.Routes.Persister.WantBorrow = function (params, response, responseDelegate) {

    // ItemId
    // UserId

    App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (users.length > 0) {

		            var guid = require("node-uuid");

		            var borrowWant = new App.DataModels.BorrowWant();
		                borrowWant.Id = guid.v4();
		                borrowWant.ItemId = params.ItemId;
		                borrowWant.UserId = params.UserId;
		                borrowWant.save(
                            function (err, data) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, []);
                                }
                                else {
                                    responseDelegate(response, []);
                                }
                            }
                        );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}
App.Routes.Persister.WantSell = function (params, response, responseDelegate) {

    // ItemId
    // UserId

    App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (users.length > 0) {

		            var guid = require("node-uuid");

		            var sellWant = new App.DataModels.SellWant();
		                sellWant.Id = guid.v4();
		                sellWant.ItemId = params.ItemId;
		                sellWant.UserId = params.UserId;
		                sellWant.save(
                            function (err, data) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, []);
                                }
                                else {
                                    responseDelegate(response, []);
                                }
                            }
                        );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}
App.Routes.Persister.WantSearch = function (params, response, responseDelegate) {

    // ItemId
    // UserId

    App.DataModels.User.find({
            Id: params.UserId
        },
		function (err, users) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (users.length > 0) {

		            var guid = require("node-uuid");

		            var searchWant = new App.DataModels.SearchWant();
		                searchWant.Id = guid.v4();
		                searchWant.ItemId = params.ItemId;
		                searchWant.UserId = params.UserId;
		                searchWant.save(
                            function (err, data) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, []);
                                }
                                else {
                                    responseDelegate(response, []);
                                }
                            }
                        );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}

App.Routes.Persister.GetInterestedUsers = function (params, response, responseDelegate) {

    // UserId

    App.DataModels.Borrow.find( {OwnerId: params.UserId},
        function (err, borrows) {
            App.DataModels.Sell.find({ OwnerId: params.UserId },
                function (err, sells) {
                    App.DataModels.Search.find({ OwnerId: params.UserId },
                        function (err, searches) {

                            var borrowIdList = [];
                            for (var i = 0; i < borrows.length; i++) {
                                borrowIdList.push(borrows[i].Id);
                            }
                            var sellIdList = [];
                            for (var j = 0; j < sells.length; j++) {
                                sellIdList.push(sells[j].Id);
                            }
                            var searchIdList = [];
                            for (var k = 0; k < searches.length; k++) {
                                searchIdList.push(searches[k].Id);
                            }

                            App.DataModels.BorrowWant.find({ ItemId: { $in: borrowIdList } },
                                function (err, borrowWants) {
                                    App.DataModels.SellWant.find({ ItemId: { $in: sellIdList } },
                                        function (err, sellWants) {
                                            App.DataModels.SearchWant.find({ ItemId: { $in: searchIdList } },
                                                function (err, searchWants) {
                                                    var count = borrowWants.length + sellWants.length + searchWants.length;

                                                    responseDelegate(response, count);
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}
App.Routes.Persister.GetInterestedUsersToBorrow = function (params, response, responseDelegate) {

    // ItemId

    App.DataModels.BorrowWant.find({
        ItemId: params.ItemId
    },
		function (err, userIds) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (userIds.length > 0) {

		            var userIdList = [];
		            for (var i = 0; i < userIds.length; i++) {
		                userIdList.push(userIds[i].UserId);
		            }

		            App.DataModels.User.find({
		                    Id: { $in: userIdList }
		                },
                        function (err, users) {
                            responseDelegate(response, users);
                        }
                    );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}
App.Routes.Persister.GetInterestedUsersToSell = function (params, response, responseDelegate) {

    // ItemId

    App.DataModels.SellWant.find({
        ItemId: params.ItemId
    },
		function (err, userIds) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (userIds.length > 0) {

		            var userIdList = [];
		            for (var i = 0; i < userIds.length; i++) {
		                userIdList.push(userIds[i].UserId);
		            }

		            App.DataModels.User.find({
		                Id: { $in: userIdList }
		            },
                        function (err, users) {
                            responseDelegate(response, users);
                        }
                    );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}
App.Routes.Persister.GetInterestedUsersToSearch = function (params, response, responseDelegate) {

    // ItemId

    App.DataModels.SearchWant.find({
        ItemId: params.ItemId
    },
		function (err, userIds) {
		    if (err) {
		        console.log(err);
		        responseDelegate(response, []);
		    }
		    else {
		        if (userIds.length > 0) {

		            var userIdList = [];
		            for (var i = 0; i < userIds.length; i++) {
		                userIdList.push(userIds[i].UserId);
		            }

		            App.DataModels.User.find({
		                Id: { $in: userIdList }
		            },
                        function (err, users) {
                            for (var i = 0; i < users.length; i++) {
                                users[i].Pass = "";
                            }

                            responseDelegate(response, users);
                        }
                    );
		        }
		        else {
		            responseDelegate(response, []);
		        }
		    }
		}
	);
}

App.Routes.GetStaticResource = function (params, response, responseDelegate) {

    // Constants
    var kHtml = ".html";
    var kCss  = ".css";
    var kJs   = ".js";
    var kPng  = ".png";
    var kIco  = ".ico";
    var kGif  = ".gif";
    
    var knownResources = [kHtml, kCss, kJs, kPng, kIco, kGif];

    var resource = params[0];
    
    var resourceCopy = resource;
        resourceCopy = resourceCopy.replace("/", "");
    if (resourceCopy.length === 0)
        resource = "/index.html";
    
    var isKnownResource = false;
    
    for (var i=0; i < knownResources.length; i++) {
        isKnownResource = isKnownResource || (resource.indexOf(knownResources[i]) !== -1);
    }

    if (isKnownResource === false) {
        console.log("DEBUG_ERR_RES: " + resource);
        response.writeHeader(404, {"Content-Type": "text/html"});  
        response.end();  
        return;
    }

    var http = require("http");
    var fs = require("fs");

    try {
        var file = "./client" + resource;

        stats = fs.lstatSync(file);
        if (stats.isFile()) {
            fs.readFile(file, function (err, html) {
                if (err) {
                    console.log("DEBUG_ERR: " + err);
                    response.writeHeader(404, {"Content-Type": "text/html"});
                    response.end();
                    //throw err; 
                }

                //responseDelegate(response, html);

                     if (resource.indexOf(kHtml) !== -1) response.writeHeader(200, {"Content-Type": "text/html"                 });
                else if (resource.indexOf(kCss)  !== -1) response.writeHeader(200, {"Content-Type": "text/css"                  });
                else if (resource.indexOf(kJs)   !== -1) response.writeHeader(200, {"Content-Type": "application/x-javascript"  });
                else if (resource.indexOf(kPng)  !== -1) response.writeHeader(200, {"Content-Type": "image/png"                 });
                else if (resource.indexOf(kIco)  !== -1) response.writeHeader(200, {"Content-Type": "image/x-icon"              });
                else if (resource.indexOf(kGif)  !== -1) response.writeHeader(200, {"Content-Type": "image/gif"                 });

                response.write(html);  
                response.end();  
            });
        }
    }
    catch (e) {
        response.writeHeader(404, {"Content-Type": "text/html"});
        response.end();
        console.log("DEBUG_EXEPTION: " + e);
    }
}

App.Routes.Persister.SaveDeviceRegistrationId = function (params, response, responseDelegate) {

    App.DataModels.Device.find( {Id: params.DeviceRegistrationId },
        function (err, devices) {
            if (err) {
                console.log(err);
                responseDelegate(response, null);
            }
            else {
                if (devices.length > 0) {
                    responseDelegate(response, "exists");
                }
                else {
                    var guid = require("node-uuid");

                    var device = new App.DataModels.Device();
                        device.Id = params.DeviceRegistrationId; //new Buffer(params.DeviceRegistrationId, "base64").toString("ascii");
                        device.UserId = "";
                        device.save( 
                            function(err, devices) {
                                if (err) {
                                    console.log(err);
                                    responseDelegate(response, "");
                                }
                                else {
                                    responseDelegate(response, device.Id);
                                }
                            }
                        );
                }
            }
        }
    );    
}

App.Routes.Persister.UpdateDeviceWithUserId = function (deviceRegistrationId, userId) {

    App.DataModels.Device.findOne({ Id: deviceRegistrationId }, function (err, doc) {

        if (err) {
            console.log(err);
        }
        else {

            console.log("###################################################################################");
            console.log("DeviceRegistrationId: " + deviceRegistrationId);
            console.log("UserId: " + userId);

            if (doc !== null) {
                doc.UserId = userId;
                doc.save();
            }
        }
    });
}
