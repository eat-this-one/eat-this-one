var nconf = require('nconf');
var gcm = require('node-gcm');

var log = require('./log.js');

var pushToGCM = function(eat, registration_ids, params) {

    params.title = 'Eat this one!';
    params.message = params.user + ' - ' + params.dish;

    // If the device is not available after 3 days don't send it.
    var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 3 * 24 * 60 * 60,
        collapseKey: params.dishid,
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

module.exports.pushToGCM = pushToGCM;
