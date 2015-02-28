var LogModel = require('../models/log.js').model;

function EatLog(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
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

    var log = new LogModel({
        what : this.eat.getParam(
            'what',
            this.attrs.what.validation,
            this.attrs.what.pattern
        ),
        where : this.eat.getParam(
            'where',
            this.attrs.where.validation,
            this.attrs.where.pattern
        ),
        target : this.eat.getParam(
            'target',
            this.attrs.target.validation,
            this.attrs.target.pattern
        )
    });

    var logCallback = function(error) {
        // We would accept a 400 as it means no token provided (guest).
        if (error && error.code !== 400) {
            return this.eat.returnCallback(error);
        }
        if (error) {
            log.userid = 0;
        } else {
            log.userid = this.eat.getUserid();
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
