var UserModel = require('../models/user.js').model;

function EatUser(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        gcmregid : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getGcmRegEx()
        },
        apntoken : {
            validation : ['isNotEmpty'],
        },
        email : {
            validation : ['isNotEmpty', 'isEmail']
        },
        name : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getStringRegEx()
        }
    };
}

/**
 * Returns all system users.
 * TODO We are not using this one, think about removing it.
 */
EatUser.prototype.get = function() {
    return this.fetch({});
};

// TODO We are not using this one, think about removing it.
EatUser.prototype.getById = function() {

    var filters = {};
    filters._id = this.eat.getParam('id', this.attrs.id.validation);
    if (filters._id === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    return this.fetchOne(filters);
};

EatUser.prototype.addUserRegid = function() {

    var userObj = {};
    userObj = this.eat.fillWithReqParams(
        userObj,
        this.attrs,
        ['name', 'email', 'gcmregid']
    );
    if (userObj === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Save the new user or update the existing one.
    this.fetchOne({gcmregid : userObj.gcmregid}, function(error, user) {
        this.prepareUserToSave(error, userObj, user);
    }.bind(this));
};

EatUser.prototype.addUserApnToken = function() {

    var userObj = {};
    userObj = this.eat.fillWithReqParams(
        userObj,
        this.attrs,
        ['name', 'email', 'apntoken']
    );
    if (userObj === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Save the new user or update the existing one.
    this.fetchOne({apntoken : userObj.apntoken}, function(error, user) {
        this.prepareUserToSave(error, userObj, user);
    }.bind(this));
};

EatUser.prototype.prepareUserToSave = function(error, userObj, user) {
    // Return any non expected error.
    if (error && error.code !== 404) {
        return this.eat.returnCallback(error);
    }

    var successStatusCode = null;
    if (!user) {
        // Create a new user.
        user = UserModel(userObj);
        successStatusCode = 201;
    } else {
        // Update the user if it already exists.
        for (var index in userObj) {
            user[index] = userObj[index];
        }
        user.modified = this.eat.getTimestamp();
        successStatusCode = 200;
    }

    return this.save(user, successStatusCode);
};

EatUser.prototype.updateRegid = function() {

    var gcmregid = this.eat.getParam(
        'gcmregid',
        this.attrs.gcmregid.validation,
        this.attrs.gcmregid.pattern
    );
    if (gcmregid === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    this.fetchOne({_id : this.eat.getUserid()}, function(error, user) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        user.modified = this.eat.getTimestamp();
        user.gcmregid = gcmregid;

        user.save(function(error) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            return this.eat.returnCallback(null, user, 200);
        }.bind(this));
    }.bind(this));
};

/**
 * @param {object} userObj Must be a plain object
 */
EatUser.prototype.clearPersonalData = function(userObj) {

    if (userObj.hasOwnProperty('toJSON')) {
        userObj = userObj.toJSON();
    }

    delete userObj.gcmregid;
    delete userObj.apntoken;
    delete userObj.created;
    delete userObj.modified;

    return userObj;
};

/**
 * Saves the provided user generating a new token.
 *
 * User data should be already verified.
 *
 * @private
 */
EatUser.prototype.save = function(user, successStatusCode, callback) {

    // Default to the return callback.
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    user.save(function(error) {
        if (error) {
            return callback(error);
        }

        // Generate a new token and once done return user + token.
        this.eat.generateNewToken(user._id, function(error, token) {
            if (error) {
                return callback(error);
            }

            // Done here, let's add token and return it.
            user = user.toJSON();
            user.token = token.token;

            return callback(null, user, successStatusCode);
        }.bind(this));
    }.bind(this));
};

/**
 * @private
 */
EatUser.prototype.fetch = function(filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    UserModel.find(filters, function(error, users) {
        if (error) {
            return callback(error);
        }
        return callback(null, users, 200);
    }.bind(this));
};

/**
 * Fetches one user from the db based on the filters provided.
 *
 * @private
 */
EatUser.prototype.fetchOne = function(filters, callback) {

    // Default to the return callback.
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    UserModel.findOne(filters, function(error, user) {
        if (error) {
            return callback(error);
        }
        if (!user) {
            return callback({
                code : 404,
                message : 'User not found'
            });
        }
        return callback(null, user, 200);
    }.bind(this));
};

module.exports = EatUser;
