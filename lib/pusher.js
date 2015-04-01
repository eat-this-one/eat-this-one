var nconf = require('nconf');
var gcm = require('node-gcm');
var apn = require('apn');

var log = require('./log.js');

var pushToGCM = function(eat, registration_ids, params) {

    params.title = 'Eat this one!';
    params.message = params.message;
    params.notId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 10000;

    delete params.from;

    // If the device is not available after 3 days don't send it.
    var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3 * 24 * 60 * 60,
        collapseKey: params.type + '-' + params.dishid,
        data: params
    });

    var sender = new gcm.Sender(nconf.get('GCM_API_KEY'));
    sender.send(message, registration_ids, 4, function(error, result) {
        if (error) {
            log('error', 'Error sending a message to GCM', eat, error);
        } else {
            log('info', 'GCM message successfully sent', eat, result);
        }
    });
};

var pushToAPN = function(eat, tokens, params) {
    var options = {
        cert : nconf.get('APN_CERT_PATH'),
        key : nconf.get('APN_KEY_PATH')
    };
    var apnConnection = new apn.Connection(options);

    var message = new apn.Notification();
    message.expiry = Math.floor(Date.now() / 1000) + 3600;
    message.alert = params.message;
    message.badge = 1;
    message.payload = {'messageFrom': params.from};

    tokens.forEach(function(token) {
        var userDevice = new apn.Device(token);
        apnConnection.pushNotification(message, userDevice);
    });
};

module.exports.pushToGCM = pushToGCM;
module.exports.pushToAPN = pushToAPN;
