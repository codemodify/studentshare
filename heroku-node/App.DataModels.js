
App.DataModels = {};

App.DataModels.Configure = function () {
	var schemaOptions = {
        toJSON: {
            virtuals: true
	    }
	};

	var userSchema = new App.Db.Schema( {
			Id: String,
			Name: String,
			Pass: String,
			Email: String
		},
		schemaOptions
	);

	var chatSchema = new App.Db.Schema({
            Id: String,
            OwnerId: String,
            Message: String,
            When: Date
		},
		schemaOptions
	);

	var borrowSchema = new App.Db.Schema({
            Id: String,
            OwnerId: String,
            Type: String,
            Phone: String,
            Email: String,
            Description: String,
            Price: String,
	        WantCount: Number
		},
		schemaOptions
	);
	var sellSchema = new App.Db.Schema( {
            Id: String,
            OwnerId: String,
            Type: String,
            Phone: String,
            Email: String,
            Description: String,
            Price: String,
            WantCount: Number
		},
		schemaOptions
	);
	var searchSchema = new App.Db.Schema( {
            Id: String,
            OwnerId: String,
            Type: String,
            Phone: String,
            Email: String,
            Description: String,
            Price: String,
            WantCount: Number
		},
		schemaOptions
	);

	var borrowWantSchema = new App.Db.Schema({
	        Id: String,
	        ItemId: String,
	        UserId: String
	    },
		schemaOptions
	);
	var sellWantSchema = new App.Db.Schema({
	        Id: String,
	        ItemId: String,
	        UserId: String
	    },
		schemaOptions
	);
	var searchWantSchema = new App.Db.Schema({
	        Id: String,
	        ItemId: String,
	        UserId: String
	    },
		schemaOptions
	);

	App.DataModels.User = App.Db.model("User", userSchema);

	App.DataModels.Chat = App.Db.model("Chat", chatSchema);

	App.DataModels.Borrow = App.Db.model("Borrow", borrowSchema);
	App.DataModels.Sell = App.Db.model("Sell", sellSchema);
	App.DataModels.Search = App.Db.model("Search", searchSchema);

	App.DataModels.BorrowWant = App.Db.model("BorrowWant", borrowWantSchema);
	App.DataModels.SellWant = App.Db.model("SellWant", sellWantSchema);
	App.DataModels.SearchWant = App.Db.model("SearchWant", searchWantSchema);
}
