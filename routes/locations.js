var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatLocations = require('../lib/EatLocations.js');

// GET - Locations list.
router.get('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var locations = new EatLocations(eat);
        return locations.getByName();
    });
});

// POST - Create a location.
router.post('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var locations = new EatLocations(eat);
        return locations.add();
    });
});

router.get('/:id', function(req, res) {
    res.send("Not supported.");
});

router.put('/:id', function(req, res) {
    res.send("Not supported.");
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
