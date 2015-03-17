var validator = require('validator');
var log = require('./log.js');

var TokenModel = require('../models/token.js').model;
var tokenManager = require('../lib/tokenManager.js');

function Eat(req, res) {
    this.req = req;
    this.res = res;
    this.userid = null;

    // Lazy loaded system components.
    this.eatLocationSubscription = null;
    this.eatLocation = null;
    this.eatDish = null;
    this.eatLocationSubscription = null;
    this.eatUser = null;
    this.eatMeal = null;
}

Eat.prototype.getReq = function() {
    return this.req;
};

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

        // Commented as we are already logging accesses.
        //log('error', '', this, error);

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
        return callback({
            code : 400,
            message : 'Wrong credentials'
        });
    }
    TokenModel.findOne({token: token}, function(error, token) {
        if (error) {
            return callback(error);
        }
        if (!token) {
            return callback({
                code : 401,
                message : 'Wrong credentials'
            });
        }

        // Set the current user id.
        this.setUserid(token.user);

        // We just execute the callback.
        return callback(null);
    }.bind(this));
};

/**
 * Checks and returns the specified request param
 *
 * If the param value is no valid returns false.
 */
Eat.prototype.getParam = function(key, validations, pattern) {

    // Getting the request value.
    var value = this.req.param(key);
    var wrong = false;

    // Unexpected contents.
    for (var index in validations) {

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
            // Think about returning the error to the client.
            // We don't log as we already have some cases
            // where we just call getParam for params we are
            // not sure are there.
            //log('error', wrong, this, value);
            return false;
        }

    }

    if (!this.hasValue(value)) {
        value = '';
    }

    // Return the value if all is good.
    return value;
};

Eat.prototype.fillWithReqParams = function(object, attrs, params) {

    for (var index in params) {
        var fieldName = params[index];

        // If it is not used send null (looks better than
        // sending something undefined).
        if (typeof attrs[fieldName].pattern === "undefined") {
            attrs[fieldName].pattern = null;
        }

        // Get the param from the request.
        object[fieldName] = this.getParam(
            fieldName,
            attrs[fieldName].validation,
            attrs[fieldName].pattern
        );

        // Return false if something went wrong.
        if (object[fieldName] === false) {
            return false;
        }
    }

    // Full object.
    return object;
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

// TODO Review this function just a copy & paste from the original one.
Eat.prototype.getYesterday = function() {
    var now = new Date();
    return Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    ) - (24 * 60 * 60);
};

Eat.prototype.getStringRegEx = function() {
    return /^[A-Za-z0-9-+_=".',;\s]*$/;
};

Eat.prototype.getGcmRegEx = function() {
    return /[0-9a-zA-Z\-\_.]*/;
};

Eat.prototype.getEatDish = function() {
    if (this.eatDish === null) {
        var EatDish = require('./EatDish.js');
        this.eatDish = new EatDish(this);
    }
    return this.eatDish;
};

Eat.prototype.getEatLocationSubscription = function() {
    if (this.eatLocationSubscription === null) {
        var EatLocationSubscription = require('./EatLocationSubscription.js');
        this.eatLocationSubscription = new EatLocationSubscription(this);
    }
    return this.eatLocationSubscription;
};

Eat.prototype.getEatLocation = function() {
    if (this.eatLocation === null) {
        var EatLocation = require('./EatLocation.js');
        this.eatLocation = new EatLocation(this);
    }
    return this.eatLocation;
};

Eat.prototype.getEatUser = function() {
    if (this.eatUser === null) {
        var EatUser = require('./EatUser.js');
        this.eatUser = new EatUser(this);
    }
    return this.eatUser;
};

Eat.prototype.getEatMeal = function() {
    if (this.eatMeal === null) {
        var EatMeal = require('./EatMeal.js');
        this.eatMeal = new EatMeal(this);
    }
    return this.eatMeal;
};

/**
 * Expects an array of objects.
 * @callback arrayCallback
 * @param {object} error
 * @param {array} array Array of objects
 */

/**
 * Expects an object as a param.
 * @callback objectCallback
 * @param {object} error
 * @param {object} An object
 */

/**
 * Expects a bool as a param.
 * @callback booleanCallback
 * @param {object} error
 * @param {boolean}
 */

module.exports = Eat;
