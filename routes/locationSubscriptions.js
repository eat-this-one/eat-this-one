var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;
var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

// GET - Locations list.
router.get('/', function(req, res) {

    if (req.param('token') === null) {
        res.statusCode = 401;
        res.send('Wrong credentials');
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

        LocationSubscriptionModel.find({userid: token.userid}, function(error, locationSubscriptions) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting location subscriptions: ' + error);
                return;
            }

            if (!locationSubscriptions) {
                res.statusCode = 200;
                res.send(locationSubscriptions);
                return;
            }

            var subscriptions = [];
            for (var subscription in locationSubscriptions) {
                subscriptions.push(subscription.locationid);
            }

            LocationModel.find({locationid: { $in: subscriptions}}, function(error, locations) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error getting locations: ' + error);
                    return;
                }

                if (!locations) {
                    res.statusCode = 500;
                    res.send('Error there are no locations for the provided ids: ' + error);
                    return;
                }

                res.statusCode = 200;
                res.send(locations);
            });
        });
    });
});

// GET - Obtain a specific location.
router.get('/:id', function(req, res) {
});

// POST - Create a location subscription.
router.post('/', function(req, res) {

    if (req.param('locationid') === null) {
        res.statusCode = 400;
        res.send('Missing params, can not create location subscription');
        return;
    }

    if (req.param('token') === null) {
        res.statusCode = 401;
        res.send('Wrong credentials');
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

        // TODO Check that the location exists.
        var locationid = req.param('locationid');

        // Setting the userid from the token.
        locationSubscriptionObj = {
            userid : token.userid,
            locationid : locationid
        };

        var locationSubscriptionInstance = new LocationSubscriptionModel(locationSubscriptionObj);
        locationSubscriptionInstance.save(function(error) {
            if (error) {
                res.statusCode = 500;
                res.send("Error saving location subscription: " + error);
                return;
            }

            // Same output for all output formats.
            res.statusCode = 201;
            res.send(locationSubscriptionInstance);
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
