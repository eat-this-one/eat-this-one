var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var TokenModel = require('../models/token.js').model;
var FeedbackModel = require('../models/feedback.js').model;

router.post('/', function(req, res) {

    if (req.param('feedback') === null) {
        res.statusCode = 400;
        res.send("Missing feedback param");
        return;
    }

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


        var feedback = new FeedbackModel({
            userid : token.userid,
            content : req.param('feedback')
        });

        feedback.save(function(error) {

            if (error) {
                res.statusCode = 500;
                res.send('Error saving feedback: ' + error);
                return;
            }

            res.statusCode = 201;
            res.send(feedback);
            return;
        });
    });
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
