var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var DishModel = require('../models/dish.js').model;
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;

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

    if (missing.length > 0 || req.param('loc') === null) {
        res.statusCode = 400;
        res.send("Missing params, can not create dish");
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

        // Setting the userid from the token.
        dishObj['userid'] = token.userid;

        // Setting the object to save.
        var dish = new DishModel(dishObj);

        // The location may exist or not, but if it does not exist
        // an address must come along with the location.
        LocationModel.findOne({name: req.param('loc')}, function(error, locationInstance) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting location');
            }

            // TODO Just make it work and we will do it properly later.
            if (locationInstance === null) {

                // We need the address then.
                if (req.param('address') === null) {
                    res.statusCode = 400;
                    res.send('Missing params, can not create location');
                }

                locationInstance = new LocationModel({
                    userid: token.userid,
                    name: req.param('loc'),
                    address: req.param('address')
                });
                locationInstance.save(function(error) {
                    if (error) {
                        res.statusCode = 500;
                        res.send('Can not save location ' + req.param('loc'));
                    }
                });

                // KILL THIS COPY & PASTE.
                dish.locationid = locationInstance.id;
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
                // FINISH KILL THIS COPY & PASTE.
            }

            dish.locationid = locationInstance.id;
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
