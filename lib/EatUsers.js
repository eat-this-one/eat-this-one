var UserModel = require('../models/user.js').model;

var Eat = require('./Eat.js');

var EatUsers = {

    userAttrs : {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        gcmregid : {
            validation : ['isNotEmpty', 'matches'],
            pattern : Eat.getGcmRegEx()
        },
        email : {
            validation : ['isNotEmpty', 'isEmail']
        },
        name : {
            validation : ['isNotEmpty', 'matches'],
            pattern : Eat.getStringRegEx()
        }
    },

    /**
     * Returns the system users
     */
    getAll : function() {

        UserModel.find(function(error, users) {
            if (error) {
                return Eat.returnCallback(error);
            }
            return Eat.returnCallback(null, users, 200);
        });
    },

    getById : function() {

        var filters = {
            _id : Eat.getParam('id', ['isNotEmpty', 'isMongoId'])
        };
        EatUsers.fetchUser(filters);
    },

    addUserRegid : function() {

        var userObj = {
            name : Eat.getParam('name', EatUsers.userAttrs.name.validation),
            email : Eat.getParam('email', EatUsers.userAttrs.email.validation),
            gcmregid : Eat.getParam('gcmregid', EatUsers.userAttrs.gcmregid.validation, EatUsers.userAttrs.gcmregid.pattern)
        };

        // Save the new user or update the existing one.
        EatUsers.fetchUser({gcmregid : userObj.gcmregid}, function(error, user) {
            // Return any non expected error.
            if (error && error.code !== 404) {
                return Eat.returnCallback(error);
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
                user.modified = Eat.getTimestamp();
                successStatusCode = 200;
            }

            EatUsers.saveUser(user, successStatusCode);

        });
    },

    updateRegid : function() {
        EatUsers.fetchUser({_id : Eat.getUserid()}, function(error, user) {
            if (error) {
                return Eat.returnCallback(error);
            }

            user.modified = Eat.getTimestamp();
            user.gcmregid = Eat.getParam(
                'gcmregid',
                EatUsers.userAttrs.gcmregid.validation,
                EatUsers.userAttrs.gcmregid.pattern
            );

            user.save(function(error) {
                if (error) {
                    Eat.returnCallback(error);
                }
                var returnUser = {
                    id: user._id,
                    email: user.email,
                    name: user.name
                };
                Eat.returnCallback(null, returnUser, 200);
            });
        });
    },

    /**
     * Saves the provided user generating a new token.
     *
     * User data should be already verified.
     *
     * @private
     */
    saveUser : function(user, successStatusCode, callback) {

        // Default to the return callback.
        if (typeof callback === 'undefined') {
            callback = Eat.returnCallback;
        }

        user.save(function(error) {
            if (error) {
                return callback(error);
            }

            // Generate a new token and once done return user + token.
            Eat.generateNewToken(user.id, function(error, token) {
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
            });
        });
    },

    /**
     * Fetches one user from the db based on the filters provided.
     *
     * @private
     */
    fetchUser : function(filters, callback) {

        // Default to the return callback.
        if (typeof callback === 'undefined') {
            callback = Eat.returnCallback;
        }
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
        });
    }
};
module.exports = EatUsers;
