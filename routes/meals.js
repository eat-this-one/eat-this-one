var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatMeal = require('../lib/EatMeal.js');

// This routes requires the user to be authenticated as they are all
// user dependant.

// GET - Meals list.
router.get('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatmeal = new EatMeal(eat);
        return eatmeal.getByUser();
    });
});

// POST - Create a meal.
router.post('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatmeal = new EatMeal(eat);
        return eatmeal.add();
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
