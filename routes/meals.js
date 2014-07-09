var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var MealModel = require('../models/meal.js').model;

// TODO: Refine returned HTTP exit codes
// TODO: Refine error messages

// GET - Meals list.
router.get('/', function(req, res) {

    MealModel.find(function(error, meals) {
        if (error) {
            console.log(error);
            res.send("No meals." + error);
        }
        res.statusCode = 200;
        res.send(meals);
    });
});

// GET - Obtain a specific meal.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    MealModel.findById(id, function(error, meal) {
        if (error) {
            console.log(error);
            res.send("Meal '" + id + "' not found. " + error);
        }
        res.statusCode = 200;
        res.send(meal);
    });
});

// POST - Create a meal.
router.post('/', function(req, res) {

    if (typeof req.param('dishid') === 'undefined') {
        res.statusCode = 400;
        res.send("Missing params, can not add meal");
    }

    if (typeof req.param('token') === 'undefined') {
        // TODO Review statusCode
        res.statusCode = 401;
        res.send('Wrong credentials');
    }

    // Getting userid from the token.
    TokenModel.findOne({token: req.param('token')}, function(error, token) {

        // TODO Review status codes here getting the token.
        if (error) {
            res.statusCode = 401;
            res.send('Wrong credentials');
        }

        if (token === null) {
            res.statusCode = 401;
            res.send('Wrong credentials');
        }

        var meal = new MealModel({
            dishid : req.param('dish'),
            userid : token.userid
        });

        // TODO Check that the dish exists.

        meal.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 400;
                res.send("Can not save meal");
            }
        });

        // Same output for all output formats.
        res.statusCode = 200;
        res.send(meal);
    });
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
