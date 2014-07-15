var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var DishModel = require('../models/dish.js').model;
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;
var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

var dishProps = {
    'name' : 'required',
    'description' : 'no',
    'from' : 'required',
    'to' : 'required',
    'nportions' : 'required',
    'donation' : 'required'
};

// GET - Dishes list.
router.get('/', function(req, res) {

    DishModel.find(function(error, dishes) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting dishes: " + error);
            return;
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
            res.statusCode = 500;
            res.send("Error getting '" + id + "' dish: " + error);
            return;
        }

        if (!dish) {
            res.statusCode = 400;
            res.send("This dish does not exist");
            return;
        }

        // We attach location data.
        LocationModel.findById(dish.locationid, function(error, locationInstance) {
            if (error) {
                res.statusCode = 500;
                res.send("Error getting '" + id + "' dish location: " + error);
                return;
            }

            var returnDish = {};
            for (var prop in dishProps) {
                returnDish[prop] = dish[prop];
            }
            returnDish.loc = locationInstance;

            res.statusCode = 200;
            res.send(returnDish);
        });
    });
});

// POST - Create a dish.
router.post('/', function(req, res) {

    if (req.param('token') === null) {
        res.statusCode = 401;
        res.send('Wrong credentials');
        return;
    }

    var dishObj = {};
    var missing = [];
    for (var prop in dishProps) {

        if (dishProps[prop] === 'required' && req.param(prop) === null) {
            missing[prop] = prop;
            continue;
        }
        dishObj[prop] = req.param(prop);
    }

    if (missing.length > 0 || req.param('loc') === null) {
        res.statusCode = 400;
        res.send("Missing params, can not create dish");
        return;
    }

    // Getting userid from the token.
    TokenModel.findOne({token: req.param('token')}, function(error, token) {

        if (error) {
            res.statusCode = 500;
            res.send('Error getting the token: ' + error);
            return;
        }

        if (!token) {
            res.statusCode = 401;
            res.send('Wrong credentials');
            return;
        }

        // Setting the userid from the token.
        dishObj['userid'] = token.userid;

        // Setting the object to save.
        var dish = new DishModel(dishObj);

        // We can receive an id or data for a new location.
        var filter = {};
        if (req.param('loc')) {
            filter.id = req.param('loc');
        } else if (req.param('locationname') && req.param('address')) {
            // Extra checking to avoid duplicates.
            filter.name = req.param('locationname');
        } else {
            // We need something!
            res.statusCode = 400;
            res.send("Missing params, can not create dish");
            return;
        }

        // The location may exist or not, but if it does not exist
        // an address must come along with the location.
        LocationModel.findOne(filter, function(error, locationInstance) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting location: ' + error);
                return;
            }

            if (!locationInstance) {

                // Create the location if it does not exist.
                locationInstance = new LocationModel({
                    userid: token.userid,
                    name: req.param('locationname'),
                    address: req.param('address')
                });

                // Save location.
                locationInstance.save(function(error) {
                    if (error) {
                        res.statusCode = 500;
                        res.send('Error saving location: ' + error);
                        return;
                    }

                    // Save dish.
                    dish.locationid = locationInstance.id;
                    dish.save(function(error) {
                        if (error) {
                            console.log(error);
                            res.statusCode = 500;
                            res.send("Error saving dish: " + error);
                            return;
                        }
                    });

                    // Same output for all output formats.
                    res.statusCode = 201;
                    res.send(dish);
                });

            } else {

                // Using the existing location.

                dish.locationid = locationInstance.id;
                dish.save(function(error) {
                    if (error) {
                        res.statusCode = 500;
                        res.send("Error saving dish: " + error);
                        return;
                    }

                    // New location subscription
                    // if it is a subscription.
                    if (!filter.id) {
                        var locationSubscriptionObj = {
                            userid : token.userid,
                            locationid : locationInstance.id
                        };

                        // Checking that it does not exist, UI should avoid it anyway.
                        LocationSubscriptionModel.findOne(locationSubscriptionObj, function(error, locationSubscription) {

                            if (error) {
                                res.statusCode = 500;
                                res.send("Error getting user location subscriptions: " + error);
                                return;
                            }

                            if (!locationSubscription) {

                                var locationSubscriptionInstance = new LocationSubscriptionModel(locationSubscriptionObject);
                                locationSubscriptionInstance.save(function(error) {
                                    if (error) {
                                        res.statusCode = 500;
                                        res.send('Error creating location subscription: ' + error);
                                        return;
                                    }

                                    res.statusCode = 201;
                                    res.send(dish);
                                    return;
                                });
                            }
                        });
                    }

                    res.statusCode = 201;
                    res.send(dish);
                    return;
                });
            }
        });
    });
});

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
