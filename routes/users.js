var express = require('express');
var mongoose = require('mongoose');
var nconf = require('nconf');
var request = require('request');

var tokenManager = require('../lib/tokenManager.js');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;

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

    // At the moment we only support google.
    if (req.param('provider') === 'google') {

        // TODO Recover code from git log if needed.
        // Removing to avoid duplicated code as google
        // is not used anymore as provided (prototype).

    } else if (req.param('provider') === 'regid') {
        // Authentication based on the registration id.

        if (req.param('name') === null) {
            res.statusCode = 400;
            res.send("Missing params, can not create user");
            return;
        }

        if (req.param('email') === null) {
            res.statusCode = 400;
            res.send("Missing params, can not create user");
            return;
        }

        if (req.param('gcmregid') === null) {
            res.statusCode = 400;
            res.send("Missing params, can not create user");
            return;
        }

        var userObj = {
            gcmregid : req.param('gcmregid'),
            name : req.param('name'),
            email : req.param('email')
        };

        // The gcmregid should be unique.
        UserModel.findOne({gcmregid: userObj.gcmregid}, function(error, user) {

            if (error) {
                res.statusCode = 500;
                res.send("Can not get user instance. Error: " + error);
                return;
            }

            // TODO Check all this update registered users data from
            // just a google email is safe; look for the returned token
            // is it the same one? Can we use it to check against?
            if (!user) {

                // If the user already exists we update the
                // existing user and we return it.
                var user = new UserModel(userObj);
            } else {
                // Update the existing user.

                var updatingUser = true;
                for (index in userObj) {
                    user[index] = userObj[index];
                }

                var now = new Date();
                user.modified = new Date(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate(),
                    now.getUTCHours(),
                    now.getUTCMinutes(),
                    now.getUTCSeconds()
                );
            }

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

                    if (typeof updatingUser !== 'undefined') {
                        res.statusCode = 200;
                    } else {
                        res.statusCode = 201;
                    }
                    res.send(returnUser);
                    return;
                });
            });
        });

    } else {
        // Nothing here.
        res.statusCode = 400;
        res.send("Incorrect '" + req.param('provider') + "' provider");
        return;
    }
});


// PUT - Update a user.
router.put('/:id', function(req, res) {
    res.send("Not supported");
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
