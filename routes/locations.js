var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatLocation = require('../lib/EatLocation.js');

// GET - Locations list.
router.get('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var loc = new EatLocation(eat);
        return loc.get();
    });
});

// POST - Create a location.
router.post('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var loc = new EatLocation(eat);
        return loc.add();
    });
});

router.get('/:id', function(req, res) {
    res.send("Not supported.");
});

router.put('/:id', function(req, res) {
    res.send("Not supported.");
});

router.post('/:id', function(req, res) {
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
