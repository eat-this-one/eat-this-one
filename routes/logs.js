var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var EatLogs = require('../lib/EatLogs.js');
var Eat = require('../lib/Eat.js');

router.post('/', function(req, res) {
    Eat.setReqRes(req, res);
    EatLogs.addLog();
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
