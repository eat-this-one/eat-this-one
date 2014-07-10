var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var LocationModel = require('../models/location.js').model;

// GET - Locations list.
router.get('/', function(req, res) {

    // Here we accept filters
    var filter = {};
    if (req.param('name') || req.param('address')) {
        if (req.param('name')) {
            if (req.param('regex')) {
                filter.name = new RegExp(req.param('name'), 'i');
            } else {
                filter.name = req.param('name');
            }
        }
        if (req.param('address')) {
            if (req.param('regex')) {
                filter.address = new RegExp(req.param('address'), 'i');
            } else {
                filter.address = req.param('address');
            }
        }
    }

    LocationModel.find(filter, function(error, locations) {
        if (error) {
            console.log(error);
            res.send("No locations." + error);
        }
        res.statusCode = 200;
        res.send(locations);
    });
});

// GET - Obtain a specific location.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    LocationModel.findById(id, function(error, loc) {
        if (error) {
            console.log(error);
            res.send("Location '" + id + "' not found. " + error);
        }
        res.statusCode = 200;
        res.send(loc);
    });
});

// POST - Create a location.
router.post('/', function(req, res) {

    var locationProps = {
        'name' : 'required',
        'address' : 'required'
    };

    var locationObj = {};
    var missing = [];
    for (var prop in locationProps) {

        if (locationProps[prop] === 'required' && typeof req.param(prop) === 'undefined') {
            missing[prop] = prop;
            continue;
        }
        locationObj[prop] = req.param(prop);
    }

    if (missing.length > 0) {
        res.statusCode = 400;
        res.send("Missing params, can not create location");
    }

    TokenModel.findOne({token: req.param('token')}, function(error, token) {

        if (error) {
            res.statusCode = 401;
            res.send('Wrong credentials');
        }

        if (token === null) {
            res.statuscode = 401;
            res.send('Wrong credentials');
        }

        // Setting the userid from the token.
        locationObj.userid = token.userid;

        var locationInstance = new LocationModel(locationObj);
        locationInstance.save(function(error) {
            if (error) {
                console.log(error);
                res.statusCode = 400;
                res.send("Can not save location " + req.param('name'));
            }
        });

        // Now we auto-subscribe the user to that location.
        var locationSubscriptionInstance = new LocationSubscriptionModel({
            userid: token.userid,
            locationid: locationInstance.id
        });

        // Same output for all output formats.
        res.statusCode = 201;
        res.send(locationInstance);
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