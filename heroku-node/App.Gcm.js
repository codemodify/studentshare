
var GCM = require('gcm').GCM;

var apiKey = 'AIzaSyABC_WDpKNNilnI-xcX3OKuMbhVmMZ7XDI';
var gcm = new GCM(apiKey);

App.Gcm = {}
App.Gcm.Send = function (key1, key2, key3) {

    App.DataModels.Device.find({},
        function (err, devices) {
            if (err) {
                console.log (err);
            }
            else if (devices.length > 0) {
                for (var i = 0; i < devices.length; i++) {

                    var gcmMessage = {
                        registration_id: devices[i].Id, // required
                        collapse_key: 'Collapse key',
                        'data.key1': key1,
                        'data.key2': key2,
                        'data.key3': key3
                    };

                    gcm.send(gcmMessage, function(err, messageId){
                        if (err) {
                            console.log (err);
                        }
                        else {
                            console.log("GCM: message sent: " + messageId);
                        }
                    });
                }
            }
        }
    );
}
