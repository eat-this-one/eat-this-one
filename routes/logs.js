var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var TokenModel = require('../models/token.js').model;
var LogModel = require('../models/log.js').model;

router.post('/', function(req, res) {

    if (req.param('what') === null) {
        res.statusCode = 400;
        res.send("Missing what param, can not add log");
        return;
    }

    if (req.param('where') === null) {
        res.statusCode = 400;
        res.send("Missing where param, can not add log");
        return;
    }

    var log = new LogModel({
        what : req.param('what'),
        where : req.param('where'),
        target : req.param('target')
    });

    // TODO Please david, learn about callbacks, every
    // time I see this routers I want to die.
    if (!req.param('token')) {

        // Guest user.
        log.userid = 0;

        log.save(function(error) {

            if (error) {
                res.statusCode = 500;
                res.send('Error saving log: ' + error);
                return;
            }

            res.statusCode = 201;
            res.send(log);
            return;
        });

    } else {
        // Getting userid from the token if there is a token
        TokenModel.findOne({token: req.param('token')}, function(error, token) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting token: ' + error);
                return;
            }

            if (!token) {
                res.statusCode = 401;
                res.send('Wrong credentials');
                return;
            }

            log.userid = token.userid;

            log.save(function(error) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error saving log: ' + error);
                    return;
                }

                res.statusCode = 201;
                res.send(log);
                return;
            });
        });
    }
});

router.get('/', function(req, res) {
    res.send("Not supported.");
});

router.put('/', function(req, res) {
    res.send("Not supported.");
});

router.delete('/', function(req, res) {
    res.send("Not supported.");
});

module.exports = router;
