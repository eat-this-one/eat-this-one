var nconf = require('nconf');
var validator = require('validator');
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
        collapseKey: params.type + '-' + params.objectid,
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
    message.payload = {
        messageFrom: params.from,
        objectid : params.objectid,
        url : params.url
    };

    tokens.forEach(function(token) {

        // Adding this checking here as we fake the apn token
        // when using the emulator or when we don't have a valid one.
        if (validator.isHexadecimal(token) === true) {
            var userDevice = new apn.Device(token);
            apnConnection.pushNotification(message, userDevice);
        }
    });
};

var sendNotifications = function(eat, users, type, objectid, url) {

    if (typeof objectid === "undefined") {
        objectid = null;
    }

    if (typeof url === "undefined") {
        url = 'index.html';
    }

    var gcmregids = [];
    var apntokens = [];
    var currentUser = null;
    users.forEach(function(user) {

        if (user._id.equals(eat.getUserid())) {
            // This one does not receive notification.
            currentUser = user;
        } else if (typeof user.gcmregid !== "undefined") {
            gcmregids.push(user.gcmregid);
        } else if (typeof user.apntoken !== "undefined") {
            apntokens.push(user.apntoken);
        }
    }.bind(this));

    // Set the message.
    var message = eat.getParam('message',
        ['isNotEmpty', 'matches'],
        eat.getStringRegEx()
    );

    // If it is not clean (it shouldn't) fallback to a crap message.
    if (message === false) {
        log('error', 'wrong message', eat, eat.req.param('message'));
        message = currentUser.name + '!';
    }

    var msgdata = {
        "message": message,
        "from" : currentUser.name,
        "type": type,
        "objectid": objectid,
        "url": url
    };

    if (gcmregids.length > 0) {
        // GCM notifications.
        pushToGCM(eat, gcmregids, msgdata);
    }
    if (apntokens.length > 0) {
        // APN notifications.
        pushToAPN(eat, apntokens, msgdata);
    }

    // TODO Email fallback for users without any GCM reg id nor iPhone.
};

module.exports.pushToGCM = pushToGCM;
module.exports.pushToAPN = pushToAPN;
module.exports.sendNotifications = sendNotifications;
