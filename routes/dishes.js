/*jslint node: true */

var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatDish = require('../lib/EatDish.js');

// GET - Dishes list.
router.get('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.getByUser();
    });
});

// GET - Obtain a specific dish.
router.get('/:id', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.getById();
    });
});

// POST - Create a dish.
router.post('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.add();
    });
});

router.put('/:id', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.update();
    });
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
