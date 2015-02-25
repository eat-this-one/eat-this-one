var LogModel = require('../models/log.js').model;

var Eat = require('./Eat.js');

var EatLogs = {

    attrs : {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        what : {
            validation : ['isNotEmpty', 'matches'],
            pattern : Eat.getStringRegEx()
        },
        where : {
            validation : ['isNotEmpty', 'matches'],
            pattern : Eat.getStringRegEx()
        },
        target : {
            validation : ['matches'],
            pattern : Eat.getStringRegEx()
        }
    },

    addLog : function() {

        var log = new LogModel({
            what : Eat.getParam(
                'what',
                EatLogs.attrs.what.validation,
                EatLogs.attrs.what.pattern
            ),
            where : Eat.getParam(
                'where',
                EatLogs.attrs.where.validation,
                EatLogs.attrs.where.pattern
            ),
            target : Eat.getParam(
                'target',
                EatLogs.attrs.target.validation,
                EatLogs.attrs.target.pattern
            )
        });

        var logCallback = function(error) {
            // We would accept a 400 as it means no token provided (guest).
            if (error && error.code !== 400) {
                Eat.returnCallback(error);
            }
            if (error) {
                log.userid = 0;
            } else {
                log.userid = Eat.getUserid();
            }

            log.save(function(error) {
                if (error) {
                    Eat.returnCallback(error);
                }
                Eat.returnCallback(null, log, 201);
            });
        }
        Eat.checkValidToken(logCallback);
    }
};

module.exports = EatLogs;
