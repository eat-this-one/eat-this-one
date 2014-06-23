var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var DishModel = require('../models/dish.js').model;

// TODO: Refine returned HTTP exit codes
// TODO: Refine error messages

// GET - Dishes list.
router.get('/', function(req, res) {

    DishModel.find(function(error, dishes) {
        if (error) {
            console.log(error);
            res.send("No dishes." + error);
        }
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
        res.send(dish);
    });
});

// POST - Create a dish.
router.post('/', function(req, res) {
    var dishProps = {
        'name' : 'required',
        'description' : 'no',
        'user' : 'required',
        'where' : 'required',
        'from' : 'required',
        'to' : 'required', 
        'nportions' : 'required',
        'donation' : 'required'
    };

    var dishObj = {};
    var missing = [];
    for (var prop in dishProps) {

        if (dishProps[prop] === 'required' && typeof req.param(prop) === 'undefined') {
            missing[prop] = prop;
            continue;
        }
        dishObj[prop] = req.param(prop);
    }

    if (missing.length > 0) {
        res.statusCode = 400;
        res.send("Missing params, can not create dish");
    }
    var dish = new DishModel(dishObj);

    dish.save(function(error) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send("Can not save user " + req.param('name'));
        }
    });

    // Same output for all output formats.
    res.send(user);
});

// PUT - Update a user.
router.put('/:id', function(req, res) {
    var id = req.param('id');
    DishModel.findById(id, function(error, dish) {

        if (error) {
            console.log(error);
            res.statusCode = 400;
            req.send("Wrong dish id");
        }

        // TODO Read req.params to update.
 
        dish.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 400;
                res.send("Can not update dish");
            }
        });
    });

    // Same output for all output formats.
    res.send(200);
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
