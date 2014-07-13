var express = require('express');
var mongoose = require('mongoose');

var encrypt = require('../lib/encrypt.js');
var tokenManager = require('../lib/tokenManager.js');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;

var userProps = {
    'name' : 'required',
    'email' : 'required',
    'password' : 'required',
};

// GET - Users list.
router.get('/', function(req, res) {

    UserModel.find(function(error, users) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting users: " + error);
            return;
        }
        res.statusCode = 200;
        res.send(users);
    });
});

// GET - Obtain a specific user.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    // TODO We should require a valid token here.

    UserModel.findById(id, function(error, user) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting '" + id + "' user: " + error);
            return;
        }
        res.statusCode = 200;
        res.send(user);
    });
});

// POST - Create an user.
router.post('/', function(req, res) {

    var userObj = {};
    var missing = [];
    for (var prop in userProps) {

        if (userProps[prop] === 'required' && req.param(prop) === null) {
            missing[prop] = prop;
            continue;
        }
        userObj[prop] = req.param(prop);
    }

    if (missing.length > 0) {
        res.statusCode = 400;
        res.send("Missing params, can not create user");
        return;
    }

    // Encrypt the provided password.
    userObj.password = encrypt.APassword(userObj.password);

    var user = new UserModel(userObj);

    user.save(function(error) {
        if (error) {
            res.statusCode = 500;
            res.send("Error saving user: " + error);
            return;
        }

        // We auto-login the user.
        var tokenData = tokenManager.new(user.id);
        var token = TokenModel(tokenData);
        token.save(function(error) {
            if (error) {
                res.statusCode = 500;
                res.send('Error creating token: ' + error);
                return;
            }

            // Add the token to the user object.
            var returnUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                token: token.token
            };

            res.statusCode = 201;
            res.send(returnUser);
        });
    });

});

// PUT - Update a user.
router.put('/:id', function(req, res) {

    var id = req.param('id');

    UserModel.findById(id, function(error, user) {

        if (error) {
            res.statusCode = 500;
            req.send("Error getting user '" + id + "': " + error);
            return;
        }

        // Updating with PUT data.
        for (var prop in userProps) {
            if (req.param(prop) !== null) {
                user[prop] = req.param(prop);

                if (prop === 'password') {
                    user[prop] = encrypt.APassword(user[prop]);
                }
            }
        }

        user.modified = new Date();
        user.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 500;
                res.send("Error saving user: " + error);
                return;
            }
        });
    });

    // Same output for all output formats.
    res.statusCode = 200;
    res.send(user);
});

router.post('/:id', function(req, req) {
    res.send("Not supported.");
});

router.delete('/:id', function(req, res) {
    res.send("Not supported.");
});

router.delete('/', function(req, res) {
    res.send("Not supported.");
});

router.put('/', function(req, res) {
    res.send("Not supported.");
});

module.exports = router;
