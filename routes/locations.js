var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Required models.
var LocationModel = require('../models/location.js').model;

// GET - Locations list.
router.get('/', function(req, res) {

    LocationModel.find(function(error, locations) {
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

    LocationModel.findById(id, function(error, location) {
        if (error) {
            console.log(error);
            res.send("Location '" + id + "' not found. " + error);
        }
        res.statusCode = 200;
        res.send(location);
    });
});

// POST - Create a location.
router.post('/', function(req, res) {
    var locationProps = {
        'name' : 'required',
        'shortname' : 'required',
        'latLng' : 'required',
        'userid' : 'required'
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
    var location = new LocationModel(locationObj);

    location.save(function(error) {
        if (error) {
            console.log(error);
            res.statusCode = 400;
            res.send("Can not save location " + req.param('name'));
        }
    });

    // Same output for all output formats.
    res.statusCode = 201;
    res.send(location);
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
