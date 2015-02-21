var express = require('express');
var mongoose = require('mongoose');

var tokenManager = require('../lib/tokenManager.js');

var Eat = require('../lib/Eat.js');
var EatUsers = require('../lib/EatUsers.js');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;

// GET - Users list.
router.get('/', function(req, res) {
    // TODO Comment it, there is no use case for it.
    //res.send("Not supported.");
    //return;
    Eat.setReqRes(req, res);
    Eat.checkValidToken(function(error) {
        if (error) {
            Eat.returnCallback(error);
        }
        EatUsers.getAll();
    });
});

// GET - Obtain a specific user.
router.get('/:id', function(req, res) {
    // TODO Comment it, there is no use case for it.
    //res.send("Not supported.");
    //return;
    Eat.setReqRes(req, res);
    Eat.checkValidToken(function(error) {
        if (error) {
            Eat.returnCallback(error);
        }
        EatUsers.getById();
    });
});

// POST - Create an user.
router.post('/', function(req, res) {

    Eat.setReqRes(req, res);

    if (req.param('provider') === 'regid') {
        // Authentication based on the registration id.
        EatUsers.addUserRegid();
    } else {
        var error = {
            code : 400,
            msg : 'Unknown auth provided'
        };
        Eat.returnCallback(error);
    }
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
