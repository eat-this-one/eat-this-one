var winston = require('winston');
var moment = require('moment');
var nconf = require('nconf');

// TODO Investigate this null value, AFAIK nconf should be static.
var startedtime = nconf.get('startedtime');
if (typeof started === "undefined") {
    startedtime = moment().format('YYYYMMDDHHmmss');
    nconf.set('startedtime', startedtime);
}

// To expressJS logger will output requests to the console.
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: nconf.get('LOGS_DIR') + '/info.' + startedtime + '.log',
            maxsize: 3000000,
            level: 'info',
            options : {
                flags: 'a'
            }
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: nconf.get('LOGS_DIR') + '/error.' + startedtime + '.log',
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
        logObj.body.photo = null;
        logObj.userid = eat.getUserid();
    }

    if (typeof object !== null && typeof object !== "undefined") {
        logObj.object = object;
    }

    logger.log(level, logObj);
};

module.exports = log;
