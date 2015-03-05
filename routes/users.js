var express = require('express');
var router = express.Router();

var Eat = require('../lib/Eat.js');
var EatUser = require('../lib/EatUser.js');

// GET - Users list.
router.get('/', function(req, res) {
    // TODO Comment it, there is no use case for it.
    //res.send("Not supported.");
    //return;
    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatuser = new EatUser(eat);
        return eatuser.get();
    });
});

// GET - Obtain a specific user.
router.get('/:id', function(req, res) {
    // TODO Comment it, there is no use case for it.
    //res.send("Not supported.");
    //return;
    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatuser = new EatUser(eat);
        return eatuser.getById();
    });
});

// POST - Create an user.
router.post('/', function(req, res) {

    var eat = new Eat(req, res);

    if (req.param('provider') === 'regid') {
        // Authentication based on the registration id.
        var eatuser = new EatUser(eat);
        return eatuser.addUserRegid();
    } else {
        var error = {
            code : 400,
            message : 'Unknown auth provided'
        };
        return eat.returnCallback(error);
    }
});

// PUT - Update an user.
router.put('/:id', function(req, res) {

    var eat = new Eat(req, res);

    if (req.param('provider') === 'regid') {

        eat.checkValidToken(function(error) {
            if (error) {
                return eat.returnCallback(error);
            }
            var eatuser = new EatUser(eat);
            return eatuser.updateRegid();
        });

    } else {
        var error = {
            code : 400,
            message : 'Unknown auth provided'
        };
        return eat.returnCallback(error);
    }
});

router.post('/:id', function(req, res) {
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
