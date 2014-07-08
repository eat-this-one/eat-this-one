var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;

// GET - Users list.
router.get('/', function(req, res) {

    UserModel.find(function(error, users) {
        if (error) {
            console.log(error);
            res.send("No users." + error);
        }
        res.statusCode = 200;
        res.send(users);
    });
});

// GET - Obtain a specific user.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    UserModel.findById(id, function(error, user) {
        if (error) {
            console.log(error);
            res.send("User '" + id + "' not found. " + error);
        }
        res.statusCode = 200;
        res.send(user);
    });
});

// POST - Create an user.
router.post('/', function(req, res) {
    var userProps = {
        'name' : 'required',
        'email' : 'required',
        'password' : 'required',
    };

    var userObj = {};
    var missing = [];
    for (var prop in userProps) {

        if (userProps[prop] === 'required' && typeof req.param(prop) === 'undefined') {
            missing[prop] = prop;
            continue;
        }
        userObj[prop] = req.param(prop);
    }

    if (missing.length > 0) {
        res.statusCode = 400;
        res.send("Missing params, can not create user");
    }
    var user = new UserModel(userObj);

    user.save(function(error) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send("Can not save user " + req.param('name'));
        }
    });

    // Same output for all output formats.
    res.statusCode = 201;
    res.send(user);
});

// PUT - Update a user.
router.put('/:id', function(req, res) {
    var id = req.param('id');
    UserModel.findById(id, function(error, user) {

        if (error) {
            console.log(error);
            res.statusCode = 400;
            req.send("Wrong user id");
        }

        // TODO Read req.params to update.
 
        user.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 400;
                res.send("Can not update user");
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
