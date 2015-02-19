var UserModel = require('../models/user.js').model;

var Eat = require('./Eat.js');

/**
 * Returns the system users
 */
module.exports.getAll = function() {

    var fetchUsers = function(error) {
        if (error) {
            return Eat.returnCallback(error);
        }
        UserModel.find(function(error, users) {
            if (error) {
                return Eat.returnCallback(error);
            }
            return Eat.returnCallback(null, users, 200);
        });
    };
    Eat.checkValidToken(fetchUsers);
};

module.exports.getOne = function() {

    var fetchUser = function(error) {

        // getParam returns error if the input is not right.
        var id = Eat.getParam('id', 'isMongoId');

        if (error) {
            return Eat.returnCallback(error);
        }
        UserModel.findById(id, function(error, user) {
            if (error) {
                return Eat.returnCallback(error);
            }
            if (!user) {
                var error = {
                    code : 404,
                    msg : 'User not found'
                };
                return Eat.returnCallback(error);
            }
            return Eat.returnCallback(null, user, 200);
        });
    };
    Eat.checkValidToken(fetchUser);
};
