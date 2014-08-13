var request = require('request');
var nconf = require('nconf');

var pushToGCM = function(registration_ids, params) {

    var options = {
        uri: nconf.get('GCM_SEND_URL'),
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'key=' + nconf.get('GCM_API_KEY')
        },
        json: {
            'registration_ids' : registration_ids
        }
    };

    // Add params.
    if (params) {
        options.json.data = params;
    }

    request.post(options, function(error, resp, body) {
        if (error) {
            console.log('Error sending a message to GCM: ' + error);
        } else {
            // Output the push results in a proper way.
            var msg = "Response from GCM. Response code: " + resp.statusCode +
                ". Successes: " + body.success + ". Failures: " + body.failure +
                ". Canonical ids: " + body.canonical_ids;
            for (var i in body.results) {
                msg += "\n  Result -> Message id: " + body.results[i].message_id +
                    ". Registration id: " + body.results[i].registration_id +
                    ". Error: " + body.results[i].error;
            }

            // TODO We should update the registration
            // id if there is one set in the response.
            console.log(msg);
        }
    });

};

module.exports.pushToGCM = pushToGCM;
