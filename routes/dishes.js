var express = require('express');
var mongoose = require('mongoose');
var pusher = require('../lib/pusher.js');

var router = express.Router();

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

        // Getting user location subscriptions.
        LocationSubscriptionModel.find({userid: token.userid}, function(error, locationSubscriptions) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting user location subscriptions');
                return;
            }

            if (!locationSubscriptions) {
                res.statusCode = 200;
                res.send([]);
                return;
            }

            var locationIds = [];
            for (var i in locationSubscriptions) {
                locationIds.push(locationSubscriptions[i].locationid);
            }

            // Only passed events when listing.
            var now = new Date();
            var yesterday = Date.UTC(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            ) - (24 * 60 * 60);
            var dishfilter = {
                locationid : {
                    $in : locationIds
                }, when : {
                    $gt : yesterday
                }
            };
            var extra = {sort: {'created' : -1}};
            DishModel.find(dishfilter, {}, extra, function(error, dishes) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Error getting dishes: " + error);
                    return;
                }

                res.statusCode = 200;
                res.send(dishes);
                return;
            });
        });
    });
});

// GET - Obtain a specific dish.
router.get('/:id', function(req, res) {

    var id = req.param('id');

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

                if (!locationInstance) {
                    res.statusCode = 500;
                    res.send("No location can be found for location id = " + dish.locationid);
                    return;
                }

                var returnDish = {};
                for (var prop in dishProps) {
                    returnDish[prop] = dish[prop];
                }
                returnDish.userid = dish.userid;
                returnDish.loc = locationInstance;

                UserModel.findById(dish.userid, function(error, user) {

                    if (error) {
                        res.statusCode = 500;
                        res.send("Error getting '" + dish.userid + "' user: " + error);
                        return;
                    }

                    // This may happen, but we hope nobody never deletes the app
                    // and it he/she does delete the app, not after adding a dish.
                    if (!user) {
                        returnDish.user = {
                            name: 'deleted',
                        };
                    } else {
                        returnDish.user = {
                            name: user.name,
                            pictureurl: user.pictureurl
                        };
                    }

                    // Remaining dishes.
                    MealModel.find({dishid : id}, function(error, bookedmeals) {

                        if (error) {
                            res.statusCode = 500;
                            res.send('Error getting booked meals');
                            return;
                        }

                        // Has the current user booked this dish?
                        // TODO Change this loop please...
                        returnDish.booked = false;
                        if (bookedmeals) {
                            for (index in bookedmeals) {
                                if (bookedmeals[index].userid === token.userid) {
                                    returnDish.booked = true;
                                }
                            }
                        }

                        // Frontend will manage to count the remaining portions.
                        returnDish.bookedmeals = bookedmeals.length;

                        // Attach the image if there is an image.
                        if (dish.photoid !== '') {
                            PhotoModel.findById(dish.photoid, function(error, photo) {
                                if (error) {
                                    res.statusCode = 500;
                                    res.send("Error getting '" + id + "' dish photo: " + error);
                                    return;
                                }

                                if (!locationInstance) {
                                    res.statusCode = 500;
                                    res.send("No photo can be found for photo id = " + dish.locationid);
                                    return;
                                }

                                returnDish.photo = "data:image/jpeg;base64," + photo.data;

                                // Sending the dish back with the image.
                                res.statusCode = 200;
                                res.send(returnDish);
                                return;
                            });
                        } else {
                            // If no picture that's all.
                            res.statusCode = 200;
                            res.send(returnDish);
                            return;
                        }
                    });
                });
            });
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

                    var returnDish = {};
                    for (var prop in dishProps) {
                        returnDish[prop] = dish[prop];
                    }
                    returnDish.userid = dish.userid;
                    returnDish.loc = locationInstance;
                    returnDish.user = {
                        name: user.name,
                        pictureurl: user.pictureurl
                    };

                    // Here we save the photo and inform subscribers in parallel.

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
                            res.send(returnDish);
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
                                res.send(returnDish);
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
                            res.statusCode = 201;
                            res.send(returnDish);
                            return;
                        });
                    });

                    // We can save the image and notify the subscribers in parallel.
                    if (req.param('photo')) {
                        savePhoto(req.param('photo'), dish);
                    }
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

            // TODO Here we skip checking that the location exists as
            // users can initially only be subscribed to one location.

            // Finally saving the dish.
            dish.save(function(error) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Error saving dish: " + error);
                    return;
                }

                // Here we save the photo and inform subscribers in parallel.

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
