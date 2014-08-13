var express = require('express');
var mongoose = require('mongoose');
var pusher = require('../lib/pusher.js');

var router = express.Router();

// Required models.
var DishModel = require('../models/dish.js').model;
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;
var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

var dishProps = {
    'name' : 'required',
    'description' : 'no',
    'locationid' : 'required',
    'from' : 'required',
    'nportions' : 'required',
    'donation' : 'required'
};

// GET - Dishes list.
router.get('/', function(req, res) {

    // Multiple filters accepted.
    var filter = {};
    if (req.param('locationid')) {
        filter.locationid = req.param('locationid');
    }

    DishModel.find(filter, function(error, dishes) {
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

    if (missing.length > 0) {
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

        // Checking that the location exists.
        LocationModel.findOne(req.param('locationid'), function(error, locationInstance) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting location: ' + error);
                return;
            }

            if (!locationInstance) {
                req.statusCode = 400;
                req.send('Error, ' + req.param('locationid') + ' does not exist');
                return;
            }

            dish.save(function(error) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Error saving dish: " + error);
                    return;
                }

                // Informing subscribers that there is a new dish.
                LocationSubscriptionModel.find({ locationid : dish.locationid}, function(error, subscriptions) {

                    if (error) {
                        res.statusCode = 500;
                        res.send('Error getting location subscriptions: ' + error);
                        return;
                    }

                    // Pity that nobody is subscribed here.
                    if (!subscriptions) {
                        res.statusCode = 201;
                        res.send(dish);
                        return;
                    }

                    var subscriptionsIds = [];
                    for (var i in subscriptions) {
                        subscriptionsIds.push(subscriptions[i].userid);
                    }

                    UserModel.find({_id : { $in : subscriptionsIds }}, function(error, subscribers) {

                        if (error) {
                            res.statusCode = 500;
                            res.send('Error getting subscribed users: ' + error);
                            return;
                        }

                        // All subscribed users are deleted?.
                        if (!subscribers) {
                            res.statusCode = 201;
                            res.send(dish);
                            return;
                        }

                        var gcmregids = [];
                        for (var i in subscribers) {
                            // Getting user GCM reg ids.
                            if (subscribers[i].gcmregids.length > 0) {
                                gcmregids = gcmregids.concat(subscribers[i].gcmregids);
                            }
                        }
                        var msgdata = {
                            "message": "New dish available!",
                            "type": "dish"
                        };

                        // GCM notifications.
                        if (gcmregids.length > 0) {
                            pusher.pushToGCM(gcmregids, msgdata);
                        }

                        // TODO Email fallback for users without any GCM reg id nor iPhone.
 
                        // All good, so we notify and finish.
                        res.statusCode = 201;
                        res.send(dish);
                        return;
                    });
                });
            });
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
