var express = require('express');
var router = express.Router();

var pusher = require('../lib/pusher.js');


// Required models.
var DishModel = require('../models/dish.js').model;
var PhotoModel = require('../models/photo.js').model;
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;
var LocationModel = require('../models/location.js').model;
var LocationSubscriptionModel = require('../models/locationSubscription.js').model;
var MealModel = require('../models/meal.js').model;

var dishProps = {
    'name' : 'required',
    'description' : 'no',
    'locationid' : 'required',
    'when' : 'required',
    'nportions' : 'required',
    'donation' : 'required'
};

var Eat = require('../lib/Eat.js');
var EatDish = require('../lib/EatDish.js');

// TODO Change this old way function format.
function savePhoto(photoparam, dish) {

    var photo = new PhotoModel({ data : photoparam });
    photo.save(function(error) {
        if (error) {
            console.log('Failed to save photo for dish id ' + dish._id + '. Error: ' + error);
        } else {

            // Update the dish with a reference to the photo.
            dish.photoid = photo._id;
            dish.save(function(error) {
                if (error) {
                    console.log('Failed to update the ' + dish._id + 'dish photo. Error: ' + error);
                }
            });
        }
    });
}

// GET - Dishes list.
router.get('/', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.getByUser();
    });
});

// GET - Obtain a specific dish.
router.get('/:id', function(req, res) {

    var eat = new Eat(req, res);
    eat.checkValidToken(function(error) {
        if (error) {
            return eat.returnCallback(error);
        }
        var eatdish = new EatDish(eat);
        return eatdish.getById();
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

        UserModel.findById(token.userid, function(error, user) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting the user: ' + error);
                return;
            }

            // This should NEVER happen.
            if (!user) {
                res.statusCode = 500;
                res.send('Error: The user does not exist!');
                return;
            }

            // Setting the userid from the token.
            dishObj['userid'] = token.userid;

            // Setting the object to save.
            var dish = new DishModel(dishObj);

            // Checking that the location exists.
            LocationModel.findOne(dishObj.locationid, function(error, locationInstance) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error getting location: ' + error);
                    return;
                }

                if (!locationInstance) {
                    req.statusCode = 400;
                    req.send('Error: location ' + dishObj.locationid + ' does not exist');
                    return;
                }

                // TODO Check that the user is subscribed to this location.

                // Checking if it is the first dish the user creates.
                // We need this value to show more options to the
                // user after creating the first dish.
                DishModel.count( {userid : token.userid}, function(error, userDishesCount) {

                    if (error) {
                        res.statusCode = 500;
                        res.send('Error getting the number of previous dishes');
                        return;
                    }

                    dish.save(function(error) {

                        if (error) {
                            res.statusCode = 500;
                            res.send("Error saving dish: " + error);
                            return;
                        }

                        var returnDish = {};
                        for (var prop in dishProps) {
                            returnDish[prop] = dish[prop];
                        }
                        returnDish.id = dish._id;
                        returnDish.userid = dish.userid;
                        returnDish.loc = locationInstance;
                        returnDish.user = {
                            name: user.name,
                            dishescount: userDishesCount + 1
                        };

                        // Here we save the photo and inform subscriptors in parallel.

                        // Informing subscriptors that there is a new dish.
                        LocationSubscriptionModel.find({ locationid : dish.locationid}, function(error, subscriptions) {

                            if (error) {
                                res.statusCode = 500;
                                res.send('Error getting location subscriptions: ' + error);
                                return;
                            }

                            // Pity that nobody is subscribed here, BUT weird,
                            // as the current user should be already subscribed here
                            if (!subscriptions) {
                                returnDish.nsubscriptors = 0;
                                res.statusCode = 201;
                                res.send(returnDish);
                                return;
                            }

                            var subscriptionsIds = [];
                            for (var i in subscriptions) {
                                subscriptionsIds.push(subscriptions[i].userid);
                            }

                            UserModel.find({_id : { $in : subscriptionsIds }}, function(error, subscriptors) {

                                if (error) {
                                    res.statusCode = 500;
                                    res.send('Error getting subscribed users: ' + error);
                                    return;
                                }

                                // All subscribed users are deleted? The current user
                                // should be subscribed so unlikely that we enter here.
                                if (!subscriptors) {
                                    returnDish.nsubscriptors = 0;
                                    res.statusCode = 201;
                                    res.send(returnDish);
                                    return;
                                }

                                var gcmregids = [];
                                for (var i in subscriptors) {
                                    gcmregids.push(subscriptors[i].gcmregid);
                                }
                                // TODO This message should be language-independent, frontend
                                // should get the string according to the params we will send from here.
                                var msgdata = {
                                    "message": "Chef " + user.name + " added a new dish! " + dish.name,
                                    "type": "dish",
                                    "dishid": dish.id
                                };

                                // GCM notifications.
                                if (gcmregids.length > 0) {
                                    pusher.pushToGCM(gcmregids, msgdata);
                                }

                                // TODO Email fallback for users without any GCM reg id nor iPhone.

                                // All good, so we notify and finish.
                                returnDish.nsubscriptors = subscriptors.length;
                                res.statusCode = 201;
                                res.send(returnDish);
                                return;
                            });
                        });

                        // We can save the image and notify the subscriptors in parallel.
                        if (req.param('photo')) {
                            savePhoto(req.param('photo'), dish);
                        }
                    });
                });
            });
        });
    });
});

router.put('/:id', function(req, res) {

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

        DishModel.findOne({_id : req.param('id')}, function(error, dish) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting the dish' + error);
                return;
            }

            if (!dish) {
                res.statusCode = 400;
                res.send('The dish id does not exist');
                return;
            }

            if (dish.userid != token.userid) {
                res.statusCode = 403;
                res.send('You can not edit that dish');
                return;
            }

            // Setting the new dish values.
            for (var prop in dishObj) {
                dish[prop] = dishObj[prop];
            }

            // Checking that the location exists.
            LocationModel.findOne(dish.locationid, function(error, locationInstance) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error getting location: ' + error);
                    return;
                }

                if (!locationInstance) {
                    req.statusCode = 400;
                    req.send('Error, ' + dish.locationid + ' does not exist');
                    return;
                }

                // TODO Check that the user is subscribed to this location.

                // Finally saving the dish.
                dish.save(function(error) {

                    if (error) {
                        res.statusCode = 500;
                        res.send("Error saving dish: " + error);
                        return;
                    }

                    // Here we save the photo and inform subscriptors in parallel.

                    // TODO Notify the subscribed users about changes in the dish.

                    // This action can begin while the notifications
                    // are being sent as the needed info is not related.
                    if (req.param('photo')) {
                        savePhoto(req.param('photo'), dish);
                    }

                    // In case the value exists (previous value or savePhoto()
                    // already finished), it is too big to be returned now.
                    delete dish.photoid;

                    res.statusCode = 200;
                    res.send(dish);
                    return;
                });
            });
        });
    });
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
