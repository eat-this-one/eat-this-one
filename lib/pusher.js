var http = require('http');
var nconf = require('nconf');

var pushToGCM = function(registration_ids, params) {

    var options = {
        host: nconf.get('GCM_SEND_HOST'),
        path: nconf.get('GCM_SEND_PATH'),
        port: nconf.get('GCM_SEND_PORT'),
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'key=' + nconf.get('GCM_API_KEY')
        }
    };

    // Add params.
    if (params) {
        options.form.data = params;
    }

    // Add destinations.
    options.form.registration_ids = registration_ids;

    // Send it, we don't need feedback.
    http.request(options, function(resp) {
        resp.on('data', function(chunk) {
            console.log('Request sent to GCM: ' + chunk);
        });
    }).on('error', function(e) {
        console.log('Error sending a message to GCM: ' + e.message);
    });

};
