var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatFeedback = require('../lib/EatFeedback.js');

router.post('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            eat.returnCallback(error);
        }
        var feedback = new EatFeedback(eat);
        return feedback.add();
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
