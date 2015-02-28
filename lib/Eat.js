var validator = require('validator');

var TokenModel = require('../models/token.js').model;
var tokenManager = require('../lib/tokenManager.js');

function Eat(req, res) {
    this.req = req;
    this.res = res;
    this.userid = null;
}

Eat.prototype.setUserid = function(userid) {
    this.userid = userid;
};

Eat.prototype.getUserid = function() {
    return this.userid;
};

/**
 * Generic callback used to return data.
 */
Eat.prototype.returnCallback = function(error, returnData, statusCode) {
    if (error) {

        // Default error code.
        if (!this.hasValue(error.code)) {
            error.code = 500;
        }
        this.res.status(error.code);
        return this.res.send(error.message);
    }
    if (!this.hasValue(statusCode)) {
        statusCode = 200;
    }
    this.res.status(statusCode);
    return this.res.send(returnData);
};

/**
 * Generates, stores and returns a new token for the provided user.
 */
Eat.prototype.generateNewToken = function(userid, callback) {

    var tokenData = tokenManager.new(userid);
    var token = TokenModel(tokenData);
    token.save(function(error) {
        if (error) {
            return callback(error);
        }
        // Return the token if all good.
        return callback(null, token);
    }.bind(this));
};

/**
 * Checks that the request token is valid.
 */
Eat.prototype.checkValidToken = function(callback) {

    var token = this.req.param('token');

    if (typeof token === 'undefined') {
        var error = {
            code : 400,
            message : 'Wrong credentials'
        };
        return callback(error);
    }
    TokenModel.findOne({token: token}, function(error, token) {
        if (error) {
            return callback(error);
        }
        if (!token) {
            var error = {
                code : 401,
                message : 'Wrong credentials'
            };
            return callback(error);
        }

        // Set the current user id.
        this.setUserid(token.userid);

        // We just execute the callback.
        return callback(null);
    }.bind(this));
};

/**
 * Checks and returns the specified request param
 *
 * It returns a 400 if the param contains
 * unexpected characters.
 */
Eat.prototype.getParam = function(key, validations, pattern) {

    // Getting the request value.
    var value = this.req.param(key);
    var wrong = false;

    // Unexpected contents.
    for (index in validations) {

        if (validations[index] === 'matches') {
            // Regex validation.
            if (this.hasValue(value) && !validator.matches(value, pattern)) {
                wrong = 'Wrong ' + key + ' value';
            }
        } else if (validations[index] === 'isNotEmpty') {
            // Custom validation as validator only have a notEmpty.
            if (this.hasValue(value) === false) {
                wrong = 'Undefined ' + key + ' value';
            }
        } else {
            // Normal validations.
            if (this.hasValue(value) && !validator[validations[index]](value)) {
                wrong = 'Wrong ' + key + ' value';
            }
        }

        if (wrong !== false) {
            var error = {
                code : 400,
                message : wrong
            };
            return this.returnCallback(error);
        }

    }

    if (!this.hasValue(value)) {
        value = '';
    }

    // Return the value if all is good.
    return value;
};

Eat.prototype.hasValue = function(value) {
    return !(
        value === '' ||
        value === null ||
        value === false ||
        typeof value === 'undefined'
    );
};

Eat.prototype.getTimestamp = function() {
    var now = new Date();
    return new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );
};

Eat.prototype.getStringRegEx = function() {
    return /^[A-Za-z0-9-_=".',;\s]*$/;
};

Eat.prototype.getGcmRegEx = function() {
    return /[0-9a-zA-Z\-\_.]*/;
};

module.exports = Eat;
