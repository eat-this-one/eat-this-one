var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;

// POST - Login an user.
router.post('/', function(req, res) {

    if (typeof req.param('email') === 'undefined' ||
            typeof req.param('password') === 'undefined') {
        res.statusCode = 400;
        res.send('Missing parameters');
    }

    // TODO Encrypt password and save encrypted too
    var userdata = {
        email : req.param('email'),
        password : req.param('password')
    };

    UserModel.findOne(userdata, function(error, user) {
        if (error) {
            res.statusCode = 401;
            res.send('Wrong credentials');
        }

        if (user === null) {
            res.statusCode = 401;
            res.send('Wrong credentials');
        }

        // TODO algorithm to generate token.
        var tokendata = {
            token : 'asdasd',
            userid : user.id,
            expires : 0
        };
        var token = TokenModel(tokendata);
        token.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 503;
                res.send('Can not generate token');
            }
        });
        res.statusCode = 200;
        res.send(token);
    });
});

module.exports = router;
