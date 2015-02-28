var UserModel = require('../models/user.js').model;

function EatUsers(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        gcmregid : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getGcmRegEx()
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
 */
EatUsers.prototype.get = function() {

    UserModel.find(function(error, users) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        return this.eat.returnCallback(null, users, 200);
    }.bind(this));
};

EatUsers.prototype.getById = function() {

    var filters = {
        _id : this.eat.getParam('id', this.attrs.id.validation)
    };
    return this.fetchOne(filters);
};

EatUsers.prototype.addUserRegid = function() {

    var userObj = {
        name : this.eat.getParam('name', this.attrs.name.validation),
        email : this.eat.getParam('email', this.attrs.email.validation),
        gcmregid : this.eat.getParam('gcmregid', this.attrs.gcmregid.validation, this.attrs.gcmregid.pattern)
    };

    // Save the new user or update the existing one.
    return this.fetchOne({gcmregid : userObj.gcmregid}, function(error, user) {
        // Return any non expected error.
        if (error && error.code !== 404) {
            return this.eat.returnCallback(error);
        }

        var successStatusCode = null;
        if (!user) {
            // Create a new user.
            var user = UserModel(userObj);
            successStatusCode = 201;
        } else {
            // Update the user if it already exists.
            for (index in userObj) {
                user[index] = userObj[index];
            }
            user.modified = this.eat.getTimestamp();
            successStatusCode = 200;
        }

        return this.save(user, successStatusCode);
    }.bind(this));
};

EatUsers.prototype.updateRegid = function() {

    this.fetchOne({_id : this.eat.getUserid()}, function(error, user) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        user.modified = this.eat.getTimestamp();
        user.gcmregid = this.eat.getParam(
            'gcmregid',
            this.attrs.gcmregid.validation,
            this.attrs.gcmregid.pattern
        );

        user.save(function(error) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            var returnUser = {
                id: user._id,
                email: user.email,
                name: user.name
            };
            return this.eat.returnCallback(null, returnUser, 200);
        }.bind(this));
    }.bind(this));
};

/**
 * Saves the provided user generating a new token.
 *
 * User data should be already verified.
 *
 * @private
 */
EatUsers.prototype.save = function(user, successStatusCode, callback) {

    // Default to the return callback.
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    user.save(function(error) {
        if (error) {
            return callback(error);
        }

        // Generate a new token and once done return user + token.
        this.eat.generateNewToken(user.id, function(error, token) {
            if (error) {
                return callback(error);
            }

            // Done here.
            var returnUser = {
                id: user._id,
                email: user.email,
                name: user.name,
                token: token.token
            };
            return callback(null, returnUser, successStatusCode);
        }.bind(this));
    }.bind(this));
};

/**
 * Fetches one user from the db based on the filters provided.
 *
 * @private
 */
EatUsers.prototype.fetchOne = function(filters, callback) {

    // Default to the return callback.
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    // We don't really need to bind EatUsers context here, but
    // doing it as we do it everywhere else.
    UserModel.findOne(filters, function(error, user) {
        if (error) {
            return callback(error);
        }
        if (!user) {
            var error = {
                code : 404,
                message : 'User not found'
            };
            return callback(error);
        }
        return callback(null, user, 200);
    }.bind(this));
};

module.exports = EatUsers;
