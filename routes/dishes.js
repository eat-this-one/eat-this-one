var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var DishModel = require('../models/dish.js').model;
var TokenModel = require('../models/token.js').model;

// TODO: Refine error messages

// GET - Dishes list.
router.get('/', function(req, res) {

    DishModel.find(function(error, dishes) {
        if (error) {
            console.log(error);
            res.send("No dishes." + error);
        }
        res.statusCode = 200;
        res.send(dishes);
    });
});

// GET - Obtain a specific dish.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    DishModel.findById(id, function(error, dish) {
        if (error) {
            console.log(error);
            res.send("Dish '" + id + "' not found. " + error);
        }
        res.statusCode = 200;
        res.send(dish);
    });
});

// POST - Create a dish.
router.post('/', function(req, res) {
    var dishProps = {
        'name' : 'required',
        'description' : 'no',
        'where' : 'required',
        'from' : 'required',
        'to' : 'required', 
        'nportions' : 'required',
        'donation' : 'required'
    };

    if (typeof req.param('token') === 'undefined') {
        // TODO Review statusCode
        res.statusCode = 401;
        res.send('Wrong credentials');
    }

    var dishObj = {};
    var missing = [];
    for (var prop in dishProps) {

        if (dishProps[prop] === 'required' && typeof req.param(prop) === 'undefined') {
            missing[prop] = prop;
            continue;
        }
        dishObj[prop] = req.param(prop);
    }

    // TODO Getting userid from the token.
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

        // Setting the userid.
        dishObj['userid'] = token.userid;

        if (missing.length > 0) {
            res.statusCode = 400;
            res.send("Missing params, can not create dish");
        }
        var dish = new DishModel(dishObj);

        dish.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 400;
                res.send("Can not save dish " + req.param('name'));
            }
        });

        // Same output for all output formats.
        res.statusCode = 201;
        res.send(dish);
    });
});

// PUT - Update a dish.
router.put('/:id', function(req, res) {
    res.send("Not supported");
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
