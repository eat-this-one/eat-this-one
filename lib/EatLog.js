var LogModel = require('../models/log.js').model;

function EatLog(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        user : {
            validation : ['isMongoId'],
        },
        what : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getStringRegEx()
        },
        where : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getStringRegEx()
        },
        target : {
            validation : ['matches'],
            pattern : eat.getStringRegEx()
        }
    };
}

EatLog.prototype.add = function() {

    var logObj = this.eat.fillWithReqParams({}, this.attrs, ['what', 'where', 'target']);
    if (logObj === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }
    var log = new LogModel(logObj);

    var logCallback = function(error) {
        // We would accept a 400 as it means no token provided (guest).
        if (error && error.code !== 400) {
            return this.eat.returnCallback(error);
        }
        if (!this.eat.hasValue(error)) {
            log.user = this.eat.getUserid();
        }

        log.save(function(error) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            return this.eat.returnCallback(null, log, 201);
        }.bind(this));
    }.bind(this);

    return this.eat.checkValidToken(logCallback);
};

module.exports = EatLog;
