var validator = require('validator');

var TokenModel = require('../models/token.js').model;

var tokenManager = require('../lib/tokenManager.js');

var Eat = {

    res : null,
    req : null,

    setReqRes : function(req, res) {
        Eat.req = req;
        Eat.res = res;
    },

    /**
     * Generic callback used to return data.
     */
    returnCallback : function(error, returnData, statusCode) {
        if (error) {
            Eat.res.statusCode = error.code;
            Eat.res.send(error.msg);
            return;
        }
        Eat.res.statusCode = statusCode;
        Eat.res.send(returnData);
        return;
    },

    /**
     * Generates, stores and returns a new token for the provided user.
     */
    generateNewToken : function(userid, callback) {

        var tokenData = tokenManager.new(userid);
        var token = TokenModel(tokenData);
        token.save(function(error) {
            if (error) {
                callback(error);
            }
            // Return the token if all good.
            callback(null, token);
        });
    },

    /**
     * Checks that the request token is valid.
     */
    checkValidToken : function(callback) {

        var token = Eat.req.param('token');

        if (typeof token == 'undefined') {
            var error = {
                code : 400,
                msg : 'Wrong credentials'
            };
            return callback(error);
        }
        TokenModel.findOne({token: token}, function(error, token) {
            if (error) {
                return callback(error);
            }
            if (!token) {
                var error = {
                    code : 400,
                    msg : 'Wrong credentials'
                };
                return callback(error);
            }

            // We just execute the callback.
            return callback(null);
        });
    },

    /**
     * Checks and returns the specified request param
     *
     * It returns a 400 if the param contains
     * unexpected characters.
     */
    getParam : function(key, validations, pattern) {

        // Getting the request value.
        var value = Eat.req.param(key);

        var wrong = false;

        // Unexpected contents.
        for (index in validations) {

            if (validations[index] === 'matches') {
                // Regex validation.
                if (!validator.matches(value, pattern)) {
                    wrong = 'Wrong ' + key + ' value';
                }
            } else if (validations[index] === 'isNotEmpty') {
                // Custom validation as validator only have a notEmpty.
                if (value === '' || value === null || typeof value == 'undefined') {
                    wrong = 'Undefined ' + key + ' value';
                }
            } else {
                // Normal validations.
                if (!validator[validations[index]](value)) {
                    wrong = 'Wrong ' + key + ' value';
                }
            }
            if (wrong !== false) {
                var error = {
                    code : 400,
                    msg : wrong
                };
                Eat.returnCallback(error);
            }

        }

        // Return the value if all is good.
        return value;
    },

    getTimestamp : function() {
        var now = new Date();
        return new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );
    },

    getStringRegEx : function() {
        return /^[A-Za-z1-9-_=".',;\s]*$/;
    },

    getGcmRegEx : function() {
        return /[0-9a-zA-Z\-\_.]*/;
    }
};

module.exports = Eat;
