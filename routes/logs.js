var express = require('express');
var router = express.Router();

var EatLogs = require('../lib/EatLogs.js');
var Eat = require('../lib/Eat.js');

router.post('/', function(req, res) {
    var eat = new Eat(req, res);
    var logs = new EatLogs(eat);
    return logs.add();
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
