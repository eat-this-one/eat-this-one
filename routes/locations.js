var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;
var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

var locationProps = {
    'name' : 'required',
};

// GET - Locations list.
router.get('/', function(req, res) {

    // TODO Check for token.

    // Here we accept filters.
    var filter = {};
    if (req.param('name')) {
        if (req.param('regex')) {
            filter.name = new RegExp(req.param('name'), 'i');
        } else {
            filter.name = req.param('name');
        }
    }

    LocationModel.find(filter, function(error, locations) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting location: " + error);
            return;
        }

        if (locations.length === 0) {
            res.statusCode = 404;
            res.send('No locations matching criteria');
            return;
        }

        res.statusCode = 200;
        res.send(locations);
        return;
    });
});

// GET - Obtain a specific location.
router.get('/:id', function(req, res) {

    // TODO Check for token.

    var id = req.param('id');

    LocationModel.findById(id, function(error, loc) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting '" + id + "' location: " + error);
            return;
        }

        if (!loc) {
            res.statusCode = 404;
            res.send('Location not found');
            return;
        }

        res.statusCode = 200;
        res.send(loc);
    });
});

// POST - Create a location.
router.post('/', function(req, res) {

    var locationObj = {};
    var missing = [];
    for (var prop in locationProps) {

        if (locationProps[prop] === 'required' && req.param(prop) === null) {
            missing[prop] = prop;
            continue;
        }
        locationObj[prop] = req.param(prop);
    }

    if (missing.length > 0) {
        res.statusCode = 400;
        res.send("Missing params, can not create location");
        return;
    }

    TokenModel.findOne({token: req.param('token')}, function(error, token) {

        if (error) {
            res.statusCode = 500;
            res.send('Error getting token: ' + error);
            return;
        }

        if (!token) {
            res.statuscode = 401;
            res.send('Wrong credentials');
            return;
        }

        LocationModel.findOne({name: locationObj.name}, function(error, loc) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting location: ' + error);
                return;
            }

            if (loc) {
                res.statuscode = 400;
                res.send('There is already a location with that name');
                return;
            }

            // Restricted to one location per user.
            LocationSubscriptionModel.find({userid: token.userid}, function(error, locationSubscriptions) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error getting possible user location subscriptions: ' + error);
                    return;
                }

                if (locationSubscriptions.length > 0) {
                    res.statusCode = 401;
                    res.send('Only one location subscription per user.');
                    return;
                }

                // Setting the userid from the token.
                locationObj.userid = token.userid;

                // Check that a location with the same name already exists.

                var locationInstance = new LocationModel(locationObj);
                locationInstance.save(function(error) {
                    if (error) {
                        res.statusCode = 500;
                        res.send("Error saving location: " + error);
                        return;
                    }

                    // Now we auto-subscribe the user to that location.
                    var locationSubscriptionInstance = new LocationSubscriptionModel({
                        userid: token.userid,
                        locationid: locationInstance.id
                    });
                    locationSubscriptionInstance.save(function(error) {
                        if (error) {
                            res.statusCode = 500;
                            res.send("Error saving location subscription: " + error);
                            return;
                        }

                        // Like in locationSubscriptions->post()
                        res.statusCode = 201;
                        res.send(locationInstance);
                    });
                });
            });
        });
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
