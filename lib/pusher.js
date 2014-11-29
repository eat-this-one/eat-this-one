var nconf = require('nconf');
var gcm = require('node-gcm');

var pushToGCM = function(registration_ids, params) {

    // If the device is not available after 3 days don't send it.
    var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3 * 24 * 60 * 60,
        data: params
    });

    var sender = new gcm.Sender(nconf.get('GCM_API_KEY'));
    sender.send(message, registration_ids, 4, function(error, result) {
        if (error) {
            console.log('Error sending a message to GCM: ' + error);
        } else {
            console.log('Message successfully sent: ' + result);
        }
    });
};

module.exports.pushToGCM = pushToGCM;
