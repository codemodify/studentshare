
App = {}

App.HouseKeeping = {}
App.HouseKeeping.FilterBorrow = false;
App.HouseKeeping.FilterSell = false;
App.HouseKeeping.FilterWanted = false;
App.HouseKeeping.LastRepliesCount = 0;

App.Run = function () {
    App.Forums.Setup();
}

App.LoadingProgress = {}
App.LoadingProgress.Show = function () {

    var dialog = jQuery("#App-LoadingProgress");
        dialog.kendoWindow({
            draggable: false,
            resizable: false,
            title: false,
            modal: true,
            actions: [],
            width: "100px",
            height: "100px"
        });
        dialog.data("kendoWindow").center();
        dialog.data("kendoWindow").open();
}
App.LoadingProgress.Hide = function () {
    jQuery("#App-LoadingProgress").data("kendoWindow").close();
}

App.Auth = {}
App.Auth.UserId = "0000-0000-0000";
App.Auth.User = "";
App.Auth.Pass = "";
App.Auth.Email = "";
App.Auth.ActionId = -1;
App.Auth.Setup = function (informAboutFunctionalities) {

    if (informAboutFunctionalities) {
        alert ("Guests are in 'read-only' mode.\n" +
               "To be able to do more you need to register.\n" +
               "Registration is easy fast & secure.");
    }

    jQuery("#App-AuthDialog-LoginButton").click(App.Auth.LoginButtonClicked);
    jQuery("#App-AuthDialog-RegisterButton").click(App.Auth.RegisterButtonClicked);

    var authDialog = jQuery("#App-AuthDialog");
        authDialog.kendoWindow({ 
            title: "Authentication Required",
            width: "270px",
            modal: true,
            resizable: false,            
            actions: ["Close"]
        });
        authDialog.data("kendoWindow").center();
        authDialog.data("kendoWindow").open();

    setTimeout(function () { jQuery("#App-AuthDialog-User").focus();}, 1000);
}
App.Auth.LoginButtonClicked = function () {
    var user = jQuery("#App-AuthDialog-User").val();
    var pass = jQuery("#App-AuthDialog-Pass").val();

    if (user.trim().length === 0 || pass.trim().length === 0)
        return;

    var service = "http://" + window.location.host + "/LoginUser/" + user + "/" + pass;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(user) {
            if (user !== null) {

                App.Auth.UserId = user.Id;
                App.Auth.User = user.Name;
                App.Auth.Pass = user.Pass;
                App.Auth.Email = user.Email;

                jQuery("#App-Content-Left-Welcome").html("Hi, " + App.Auth.User);
                jQuery("#App-AuthDialog").data("kendoWindow").close();
                if (App.Auth.ActionId !== -1)
                    App.Forums.LoadRouter();
                else
                    App.Forums.Setup();
            }
            else {
                alert("Sorry no such user. You'll have to register.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}
App.Auth.RegisterButtonClicked = function () {
    var user = jQuery("#App-AuthDialog-User").val();
    var pass = jQuery("#App-AuthDialog-Pass").val();

    if (user.trim().length === 0 || pass.trim().length === 0)
        return;

    var service = "http://" + window.location.host + "/RegisterUser/" + user + "/" + pass;
    
    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function (userId) {

            if (userId === "exists") {
                alert("User already exists. Pick another one.");
                return;
            }

            if (userId.length > 0) {

                App.Auth.UserId = userId;
                App.Auth.User = user;
                App.Auth.Pass = pass;

                jQuery("#App-Content-Left-Welcome").html("Hi, " + App.Auth.User);
                jQuery("#App-AuthDialog").data("kendoWindow").close();
                if (App.Auth.ActionId !== -1)
                    App.Forums.LoadRouter();
                else
                    App.Forums.Setup();
            }
            else {
                alert("Sorry no such user. You'll have to register.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}

App.Forums = {}

App.Forums.DataSourceBackend = new kendo.data.ObservableArray([]);
App.Forums.DataSource = new kendo.data.DataSource({ data: App.Forums.DataSourceBackend, pageSize: 12 });

App.Forums.ChatLastId = "0000-0000-0000";
App.Forums.ChatDataSourceBackend = new kendo.data.ObservableArray([]);
App.Forums.ChatDataSource = new kendo.data.DataSource({ data: App.Forums.ChatDataSourceBackend });

App.Forums.Setup = function () {

    jQuery("#App-Content-Left").css("visibility", "visible");
    jQuery("#App-Content-Right").css("visibility", "visible");

    jQuery("#panelbar").kendoPanelBar({
        expandMode: "single",
        select: App.Forums.LoadRouter
    });

    var dialog = jQuery("#App-Content-Right");
        dialog.kendoWindow({ 
            title: "Choose a forum",
            width: "500px",
            height: "576px",
            resizable: false,
            actions: ["New"]
        });
        dialog.data("kendoWindow").open();
        dialog.closest(".k-window").css({
            top: 30,
            left: 370,
        });
        dialog.data("kendoWindow").wrapper.find(".k-i-new").click( function (e) {
            App.Forums.AddNewRouter();
            e.preventDefault();
        });

    jQuery("#pager").kendoPager({
        dataSource: App.Forums.DataSource
    });

    jQuery("#listView").kendoListView({
        dataSource: App.Forums.DataSource,
        template: kendo.template($("#template").html())
    });

    var options = {
        show_labels: true,
        labels_placement: "both",
        on_label: "Me&nbsp;",
        off_label: "all",
        width: 40,
        height: 20,
        button_width: 20
    };
    jQuery("#borrowMy").switchButton(options).change(function (e) {
        App.HouseKeeping.FilterBorrow = jQuery("#borrowMy").prop("checked");
        App.Forums.LoadBorrow();
    });
    jQuery("#sellMy").switchButton(options).change(function (e) {
        App.HouseKeeping.FilterSell = jQuery("#sellMy").prop("checked");
        App.Forums.LoadSell();
    });
    jQuery("#wantedMy").switchButton(options).change(function (e) {
        App.HouseKeeping.FilterWanted = jQuery("#wantedMy").prop("checked");
        App.Forums.LoadSearch();
    });

    if (App.Auth.UserId !== "0000-0000-0000") {
        setTimeout(App.Forums.PullNotifications, 3000);
    }
}
App.Forums.PullNotifications = function () {

    var service = "http://" + window.location.host + "/GetInterestedUsers/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function (count) {

            if (App.HouseKeeping.LastRepliesCount !== count) {

                jQuery("#App-Content-Left-Forums-Replies").html(count);

                App.HouseKeeping.LastRepliesCount = count;

                ////////jQuery("#App-Content-Left-Forums-Replies").css("color", "red");
                ////////jQuery("#App-Content-Left-Forums-Replies").css("font-weight", "bold");

                jQuery("#App-Content-Left-Forums-Replies").kendoTooltip({
                    content: count,
                    position: "top"
                }).show();

                var tooltip = jQuery("#App-Content-Left-Forums-Replies").kendoTooltip({
                    showOn: "click",
                    autoHide: true,
                    position: "bottom",
                    content: "You have new feedback"
                });
                tooltip.data("kendoTooltip").show(jQuery("#App-Content-Left-Forums-Replies"));
            }
            else {
                //jQuery("#App-Content-Left-Forums-Replies").css("color", "black");
                //jQuery("#App-Content-Left-Forums-Replies").css("font-weight", "normal");
            }
            
            setTimeout(App.Forums.PullNotifications, 5000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}

App.Forums.LoadRouter = function (e) {

    var text = $(e.item).find("> .k-link").text().trim();

    if (text.indexOf("Chat !") !== -1 ) {
        App.Forums.LoadChat();
        return;
    }

    text = text.replace("allMe","").trim();
    jQuery("#App-Content-Right").data("kendoWindow").title(text);

    if (text.indexOf("Borrow") !== -1 ) {
        App.Auth.ActionId = 0;
        App.Forums.LoadBorrow();
    }

    else if (text.indexOf("Get Rid (sell)") !== -1 ) {
        App.Auth.ActionId = 1;
        App.Forums.LoadSell();
    }

    else if (text.indexOf("Wanted (buy)") !== -1) {
        App.Auth.ActionId = 2;
        App.Forums.LoadSearch();
    }
}
App.Forums.LoadBorrow = function () {
    App.LoadingProgress.Show();
    
    var service = "http://" + window.location.host + "/LoadBorrow/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(data) {

            while (App.Forums.DataSourceBackend.length > 0)
                App.Forums.DataSourceBackend.pop();

            if (App.HouseKeeping.FilterBorrow) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].OwnerId === App.Auth.UserId) {
                        data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                        App.Forums.DataSourceBackend.push(data[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                    App.Forums.DataSourceBackend.push(data[i]);
                }
            }
            
            App.LoadingProgress.Hide();            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            App.LoadingProgress.Hide();        
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}
App.Forums.LoadSell = function () {
    App.LoadingProgress.Show();

    var service = "http://" + window.location.host + "/LoadSell/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(data) {

            while (App.Forums.DataSourceBackend.length > 0)
                App.Forums.DataSourceBackend.pop();

            if (App.HouseKeeping.FilterSell) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].OwnerId === App.Auth.UserId) {
                        data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                        App.Forums.DataSourceBackend.push(data[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                    App.Forums.DataSourceBackend.push(data[i]);
                }
            }
            
            App.LoadingProgress.Hide();            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            App.LoadingProgress.Hide();
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}
App.Forums.LoadSearch = function () {
    App.LoadingProgress.Show();
    
    var service = "http://" + window.location.host + "/LoadSearch/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(data) {

            while (App.Forums.DataSourceBackend.length > 0)
                App.Forums.DataSourceBackend.pop();

            if (App.HouseKeeping.FilterWanted) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].OwnerId === App.Auth.UserId) {
                        data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                        App.Forums.DataSourceBackend.push(data[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    data[i].CanDelete = (data[i].OwnerId === App.Auth.UserId) ? "visibleElement" : "hiddenElement";
                    App.Forums.DataSourceBackend.push(data[i]);
                }
            }

            App.LoadingProgress.Hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            App.LoadingProgress.Hide();
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });    
}
App.Forums.LoadChat = function () {

    var isVisible = jQuery("#App-Content-Right-Chat").css("visibility");
    if (isVisible !== "visible") {
        jQuery("#App-Content-Right-Chat").css("visibility", "visible");

        var dialog = jQuery("#App-Content-Right-Chat");
            dialog.kendoWindow({
                title: "Chat !",
                width: "300px",
                height: "400px",
                resizable: false,
                actions: ["ReloadMessages"]
            });
            dialog.data("kendoWindow").open();
            dialog.closest(".k-window").css({
                top: 70,
                left: 470,
            });
            dialog.data("kendoWindow").wrapper.find(".k-i-reloadmessages").click(function (e) {
                e.preventDefault();
            });

        jQuery("#App-Content-Right-Chat-ListView").kendoListView({
            dataSource: App.Forums.ChatDataSource,
            template: kendo.template($("#App-Content-Right-Chat-Template").html())
        });

        jQuery("#App-Content-Right-Chat-SendButton").click(function (e) {

            e.preventDefault();

            if (App.Auth.UserId === "" || App.Auth.User === "" || App.Auth.Pass === "") {
                App.Auth.Setup(true);
                return;
            }

            var message = jQuery("#App-Content-Right-Chat-Message").val();
            if (message === "")
                return;

            jQuery("#App-Content-Right-Chat-Message").val("");

            var service = "http://" + window.location.host + "/ChatSendMessage"
                + "/" + App.Auth.UserId
                + "/" + jQuery.base64.encode(message);

            jQuery.ajax({
                url: service,
                dataType: "json",
                cache: false,
                timeout: 5000,
                success: function (data) {

                    App.Forums.LoadChatContent(false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    App.LoadingProgress.Hide();
                    alert('Error: ' + textStatus + " " + errorThrown);
                }
            });
        });

        App.Forums.LoadChatContent(true);
    }
    else {
        var dialog = jQuery("#App-Content-Right-Chat");
            dialog.data("kendoWindow").open();
    }
}
App.Forums.LoadChatContent = function (repeat) {
    var service = "http://" + window.location.host + "/ChatGetMessages"
        + "/" + App.Auth.UserId
        + "/" + App.Forums.ChatLastId;

    var dialog = jQuery("#App-Content-Right-Chat");
        dialog.data("kendoWindow").wrapper.find(".k-i-reloadmessages").show();

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(data) {

            //if (App.Auth.UserId === "" || App.Auth.User === "" || App.Auth.Pass === "") {

            while (App.Forums.ChatDataSourceBackend.length > 0)
                App.Forums.ChatDataSourceBackend.pop();

            // }
            for (var i=0; i < data.length; i++) {
                App.Forums.ChatDataSourceBackend.push(data[i]);
            }
            dialog.data("kendoWindow").wrapper.find(".k-i-reloadmessages").hide();

            //var listView = $("#App-Content-Right-Chat-ListView");
            //listView.scrollTop(listView[0].scrollHeight);

            if (repeat) {
                setTimeout(function () { App.Forums.LoadChatContent(true); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            dialog.data("kendoWindow").wrapper.find(".k-i-reloadmessages").hide();
            //////alert('Error: ' + textStatus + " " + errorThrown);

            if (repeat) {
                setTimeout(function () { App.Forums.LoadChatContent(true); }, 2000);
            }
        }
    });
}

App.Forums.AddNewRouter = function () {
    if (App.Auth.UserId === "" || App.Auth.User === "" || App.Auth.Pass === "") {
        App.Auth.Setup(true);
        return;
    }

    jQuery("#App-AddNew-Sell-AddButton").unbind("click");
    jQuery("#App-AddNew-Sell-CancelButton").unbind("click");
    jQuery("#App-AddNew-Sell-Type").kendoDropDownList();
    
    jQuery("#App-AddNew-Sell-CancelButton").click(function () {
        jQuery("#App-AddNew-Sell").data("kendoWindow").close();
    });

    var title = "";

    if (App.Auth.ActionId === 0) {
        title = "Borrow";
        App.Forums.AddNewBorrow();
    }
    else if (App.Auth.ActionId === 1) {
        title = "Get Rid Of";
        App.Forums.AddNewSell();
    }
    else if (App.Auth.ActionId === 2) {
        title = "Wanted";
        App.Forums.AddNewSearch();
    }
    else if (App.Auth.ActionId === 3) {
        App.Forums.AddNewChat();
        return;
    }
    
    var dialog = jQuery("#App-AddNew-Sell");
        dialog.kendoWindow({ 
            title: title,
            width: "300px",
            modal: true,
            resizable: false,
            actions: []
        });
        dialog.data("kendoWindow").title(title);
        dialog.data("kendoWindow").center();
        dialog.data("kendoWindow").open();
}
App.Forums.AddNewBorrow = function (id) {
    jQuery("#App-AddNew-Sell-AddButton").click(function () {

        var type  = jQuery("#App-AddNew-Sell-Type").val();
        var phone = jQuery("#App-AddNew-Sell-Phone").val();
        var email = jQuery("#App-AddNew-Sell-Email").val();
        var desc  = jQuery("#App-AddNew-Sell-Description").val();
        var price = jQuery("#App-AddNew-Sell-Price").val();

        if (phone.trim().length === 0
            && email.trim().length === 0
            && desc.trim().length === 0
            && price.trim().length === 0)
            return;

            type  = type.length  === 0 ? " " : type;
            phone = phone.length === 0 ? " " : phone;
            email = email.length === 0 ? " " : email;
            desc  = desc.length  === 0 ? " " : desc;
            price = price.length === 0 ? " " : price;

        var service = "http://" + window.location.host + "/AddBorrow" 
            + "/" + App.Auth.UserId
            + "/" + jQuery.base64.encode(type)
            + "/" + jQuery.base64.encode(phone)
            + "/" + jQuery.base64.encode(email.replace(".", " . ").replace("@", " @ "))
            + "/" + jQuery.base64.encode(desc)
            + "/" + jQuery.base64.encode(price);

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function(sellId) {
                if (sellId.length > 0) {
                    jQuery("#App-AddNew-Sell").data("kendoWindow").close();
                }
                else {
                    alert("Sorry some error happened while adding.");
                }
                    
                App.Forums.LoadBorrow();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    });
}
App.Forums.AddNewSell = function (id) {
    jQuery("#App-AddNew-Sell-AddButton").click(function () {

        var type  = jQuery("#App-AddNew-Sell-Type").val();
        var phone = jQuery("#App-AddNew-Sell-Phone").val();
        var email = jQuery("#App-AddNew-Sell-Email").val();
        var desc  = jQuery("#App-AddNew-Sell-Description").val();
        var price = jQuery("#App-AddNew-Sell-Price").val();
            
        if (phone.trim().length === 0
            && email.trim().length === 0
            && desc.trim().length === 0
            && price.trim().length === 0)
            return;

            type  = type.length  === 0 ? " " : type;
            phone = phone.length === 0 ? " " : phone;
            email = email.length === 0 ? " " : email;
            desc  = desc.length  === 0 ? " " : desc;
            price = price.length === 0 ? " " : price;

        var service = "http://" + window.location.host + "/AddSell" 
            + "/" + App.Auth.UserId
            + "/" + jQuery.base64.encode(type)
            + "/" + jQuery.base64.encode(phone)
            + "/" + jQuery.base64.encode(email.replace(".", " . ").replace("@", " @ "))
            + "/" + jQuery.base64.encode(desc)
            + "/" + jQuery.base64.encode(price);

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function(sellId) {
                if (sellId.length > 0) {
                    jQuery("#App-AddNew-Sell").data("kendoWindow").close();
                }
                else {
                    alert("Sorry some error happened while adding.");
                }
                    
                App.Forums.LoadSell();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    });
}
App.Forums.AddNewSearch = function (id) {
    jQuery("#App-AddNew-Sell-AddButton").click(function () {

        var type  = jQuery("#App-AddNew-Sell-Type").val();
        var phone = jQuery("#App-AddNew-Sell-Phone").val();
        var email = jQuery("#App-AddNew-Sell-Email").val();
        var desc  = jQuery("#App-AddNew-Sell-Description").val();
        var price = jQuery("#App-AddNew-Sell-Price").val();
            
        if (phone.trim().length === 0
            && email.trim().length === 0
            && desc.trim().length === 0
            && price.trim().length === 0)
            return;

            type  = type.length  === 0 ? " " : type;
            phone = phone.length === 0 ? " " : phone;
            email = email.length === 0 ? " " : email;
            desc  = desc.length  === 0 ? " " : desc;
            price = price.length === 0 ? " " : price;

        var service = "http://" + window.location.host + "/AddSearch" 
            + "/" + App.Auth.UserId
            + "/" + jQuery.base64.encode(type)
            + "/" + jQuery.base64.encode(phone)
            + "/" + jQuery.base64.encode(email.replace(".", " . ").replace("@", " @ "))
            + "/" + jQuery.base64.encode(desc)
            + "/" + jQuery.base64.encode(price);

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function(sellId) {
                if (sellId.length > 0) {
                    jQuery("#App-AddNew-Sell").data("kendoWindow").close();
                }
                else {
                    alert("Sorry some error happened while adding.");
                }
                    
                App.Forums.LoadSearch();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    });
}

App.Forums.RemoveRouter = function (id) {
    if (App.Auth.UserId === "" || App.Auth.User === "" || App.Auth.Pass === "") {
        App.Auth.Setup(true);
        return;
    }

    var confirmation = confirm("Sure To Delete ?");
    if (confirmation !== true)
        return;

    if (App.Auth.ActionId === 0)
        App.Forums.RemoveBorrow(id);

    else if (App.Auth.ActionId === 1)
        App.Forums.RemoveSell(id);

    else if (App.Auth.ActionId === 2)
        App.Forums.RemoveSearch(id);
}
App.Forums.RemoveBorrow = function (id) {

    var service = "http://" + window.location.host + "/RemoveBorrow" 
        + "/" + id
        + "/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(data) {
            App.Forums.LoadBorrow();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}
App.Forums.RemoveSell = function (id) {
    var service = "http://" + window.location.host + "/RemoveSell"
        + "/" + id
        + "/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function (data) {
            App.Forums.LoadSell();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}
App.Forums.RemoveSearch = function (id) {
    var service = "http://" + window.location.host + "/RemoveSearch"
        + "/" + id
        + "/" + App.Auth.UserId;

    jQuery.ajax({
        url: service,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function (data) {
            App.Forums.LoadSearch();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + " " + errorThrown);
        }
    });
}

App.Forums.WantRouter = function (id) {
    if (App.Auth.UserId === "" || App.Auth.User === "" || App.Auth.Pass === "") {
        App.Auth.Setup(true);
        return;
    }

    if (App.Auth.Email === "" || App.Auth.Email === null || App.Auth.Email === undefined) {
        var confirmation = confirm("When you WANT stuff, it is a good idea to set your email.\n" +
                                   "Not requried but this way the author could contact you.");
        if (confirmation === true) {
            jQuery("#App-SettingsDialog-OkButton").unbind("click");
            jQuery("#App-SettingsDialog-OkButton").click(function (e) {
                e.preventDefault();

                var email = jQuery("#App-SettingsDialog-Email").val();

                if (email.trim().length === 0) {
                    alert("Set email");
                    return;
                }

                var service = "http://" + window.location.host + "/UpdateUserProfile/" + App.Auth.UserId + "/" + email;

                jQuery.ajax({
                    url: service,
                    dataType: "json",
                    cache: false,
                    timeout: 5000,
                    success: function (data) {

                        App.Auth.Email = email;

                        var dialog = jQuery("#App-SettingsDialog");
                            dialog.data("kendoWindow").close();

                        if (data === false) {
                            alert("Error while updating your profile.");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var dialog = jQuery("#App-SettingsDialog");
                            dialog.data("kendoWindow").close();

                        alert('Error: ' + textStatus + " " + errorThrown);
                    }
                });
            });

            var dialog = jQuery("#App-SettingsDialog");
                dialog.kendoWindow({
                    title: "Profile Update",
                    width: "270px",
                    modal: true,
                    resizable: false,
                    actions: ["Close"]
                });
                dialog.data("kendoWindow").center();
                dialog.data("kendoWindow").open();

            setTimeout(function () { jQuery("#App-SettingsDialog-Email").focus(); }, 1000);
        }
    }

    App.Forums.WantRouterHelper(id);
}
App.Forums.WantRouterHelper = function (id) {
    if (App.Auth.ActionId === 0)
        App.Forums.WantBorrow(id);

    else if (App.Auth.ActionId === 1)
        App.Forums.WantSell(id);

    else if (App.Auth.ActionId === 2)
        App.Forums.WantSearch(id);
}
App.Forums.WantBorrow = function (id) {

    var ownerId = "";

    for (var i = 0; i < App.Forums.DataSourceBackend.length; i++) {
        if (App.Forums.DataSourceBackend[i].Id === id) {
            ownerId = App.Forums.DataSourceBackend[i].OwnerId;
            break;
        }
    }

    if (ownerId === App.Auth.UserId) {
        var service = "http://" + window.location.host + "/GetInterestedUsersToBorrow/" + id;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (users) {
                var dialog = jQuery("#App-ShowInterestedUsers");
                    dialog.kendoWindow({
                        title: "Interested Users",
                        width: "300px",
                        height: "400px",
                        resizable: true,
                        actions: ["Close"]
                    });
                    dialog.data("kendoWindow").open();
                    dialog.closest(".k-window").css({
                        top: 70,
                        left: 470,
                    });

                var html = "<table>";
                for (var i = 0; i < users.length; i++) {
                    html = html + "<tr><td>" + users[i].Name + "</td><td> -> </td><td><a href='mailto:" + users[i].Email + "'>" + users[i].Email + "</td></tr>";
                }
                html = html + "</table>";
                dialog.html(html);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
    else {
        var service = "http://" + window.location.host + "/WantBorrow"
            + "/" + id
            + "/" + App.Auth.UserId;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (data) {
                App.Forums.LoadBorrow();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
}
App.Forums.WantSell = function (id) {

    var ownerId = "";

    for (var i = 0; i < App.Forums.DataSourceBackend.length; i++) {
        if (App.Forums.DataSourceBackend[i].Id === id) {
            ownerId = App.Forums.DataSourceBackend[i].OwnerId;
            break;
        }
    }

    if (ownerId === App.Auth.UserId) {
        var service = "http://" + window.location.host + "/GetInterestedUsersToSell/" + id;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (users) {
                var dialog = jQuery("#App-ShowInterestedUsers");
                    dialog.kendoWindow({
                        title: "Interested Users",
                        width: "300px",
                        height: "400px",
                        resizable: true,
                        actions: ["Close"]
                    });
                    dialog.data("kendoWindow").open();
                    dialog.closest(".k-window").css({
                        top: 70,
                        left: 470,
                    });

                var html = "<table>";
                for (var i = 0; i < users.length; i++) {
                    html = html + "<tr><td>" + users[i].Name + "</td><td> -> </td><td><a href='mailto:" + users[i].Email + "'>" + users[i].Email + "</td></tr>";
                }
                html = html + "</table>";
                dialog.html(html);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
    else {
        var service = "http://" + window.location.host + "/WantSell"
            + "/" + id
            + "/" + App.Auth.UserId;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (data) {
                App.Forums.LoadSell();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
}
App.Forums.WantSearch = function (id) {

    var ownerId = "";

    for (var i = 0; i < App.Forums.DataSourceBackend.length; i++) {
        if (App.Forums.DataSourceBackend[i].Id === id) {
            ownerId = App.Forums.DataSourceBackend[i].OwnerId;
            break;
        }
    }

    if (ownerId === App.Auth.UserId) {
        var service = "http://" + window.location.host + "/GetInterestedUsersToSearch/" + id;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (users) {
                var dialog = jQuery("#App-ShowInterestedUsers");
                    dialog.kendoWindow({
                        title: "Interested Users",
                        width: "300px",
                        height: "400px",
                        resizable: true,
                        actions: ["Close"]
                    });
                    dialog.data("kendoWindow").open();
                    dialog.closest(".k-window").css({
                        top: 70,
                        left: 470,
                    });

                var html = "<table>";
                for (var i = 0; i < users.length; i++) {
                    html = html + "<tr><td>" + users[i].Name + "</td><td> -> </td><td><a href='mailto:" + users[i].Email + "'>" + users[i].Email + "</td></tr>";
                }
                html = html + "</table>";
                dialog.html(html);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
    else {
        var service = "http://" + window.location.host + "/WantSearch"
            + "/" + id
            + "/" + App.Auth.UserId;

        jQuery.ajax({
            url: service,
            dataType: "json",
            cache: false,
            timeout: 5000,
            success: function (data) {
                App.Forums.LoadSearch();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + " " + errorThrown);
            }
        });
    }
}
