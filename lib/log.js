var winston = require('winston');
var nconf = require('nconf');

// To expressJS logger will output requests to the console.
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: nconf.get('LOGS_DIR') + '/info.' + nconf.get('startedtime') + '.log',
            maxsize: 3000000,
            level: 'info',
            options : {
                flags: 'a'
            }
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: nconf.get('LOGS_DIR') + '/error.' + nconf.get('startedtime') + '.log',
            maxsize: 3000000,
            level: 'error',
            options : {
                flags: 'a'
            }
        })
    ]
});

var log = function(level, message, eat, object) {

    var logObj = {};
    logObj.message = message;

    if (typeof eat !== null && typeof eat !== "undefined") {
        var req = eat.getReq();

        logObj.ip = req.ip;
        logObj.url = req.originalUrl;
        logObj.body = req.body;
        logObj.userid = eat.getUserid();
    }

    if (typeof object !== null && typeof object !== "undefined") {
        logObj.object = object;
    }

    logger.log(level, logObj);
};

module.exports = log;
