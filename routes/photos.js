var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatPhoto = require('../lib/EatPhoto.js');

router.get('/', function(req, res) {
    var eat = new Eat(req, res);
    var photo = new EatPhoto(eat);
    return photo.get();
});

router.post('/', function(req, res) {
    res.send("Not supported.");
});

router.put('/', function(req, res) {
    res.send("Not supported.");
});

router.delete('/', function(req, res) {
    res.send("Not supported.");
});

module.exports = router;
