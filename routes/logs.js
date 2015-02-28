var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatLog = require('../lib/EatLog.js');

router.post('/', function(req, res) {
    var eat = new Eat(req, res);
    var log = new EatLog(eat);
    return log.add();
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
