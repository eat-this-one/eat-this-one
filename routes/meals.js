var express = require('express');
var mongoose = require('mongoose');
var pusher = require('../lib/pusher.js');

var router = express.Router();

// Required models.
var MealModel = require('../models/meal.js').model;
var TokenModel = require('../models/token.js').model;
var DishModel = require('../models/dish.js').model;
var UserModel = require('../models/user.js').model;

// This routes requires the user to be authenticated as they are all
// user dependant.

// GET - Meals list.
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

        MealModel.find({userid: token.userid}, function(error, meals) {

            if (error) {
                res.statusCode = 500;
                res.send("Error getting meals: " + error);
                return;
            }

            // If no meals we return an empty array.
            if (!meals) {
                res.statusCode = 200;
                res.send([]);
                return;
            }

            var dishes = [];
            meals.forEach(function(meal) {
                dishes.push(meal.dishid);
            });

            DishModel.find({_id : { $in : dishes }}, function(error, dishes) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Error getting dishes: " + error);
                    return;
                }

                if (!dishes) {
                    res.statusCode = 500;
                    res.send('Error, no dishes found for the provided ids: ' + error);
                    return;
                }

                res.statusCode = 200;
                res.send(dishes);
            });
        });

    });
});

// GET - Obtain a specific meal.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    if (req.param('token') === null) {
        res.statusCode = 401;
        res.send('Wrong credentials');
        return;
    }

    // Only the meal user or the chef can see a meal.
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

        MealModel.findById(id, function(error, meal) {

            if (error) {
                res.statusCode = 500;
                res.send("Error getting '" + id + "' meal: " + error);
                return;
            }

            if (!meal) {
                res.statusCode = 400;
                res.send('The requested meal does not exist');
                return;
            }

            // We attach the dish info to the meal.
            DishModel.findById(meal.dishid, function(error, dish) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Error getting '" + id + "' meal's dish: " + error);
                    return;
                }

                if (!dish) {
                    res.statusCode = 400;
                    res.send(id + " meal's dish does not exist");
                    return;
                }

                // Only meal's user and the chef accepted as meal's viewers.
                if (meal.userid === token.userid ||
                        meal.userid === dish.userid) {
                    res.statusCode = 401;
                    res.send("You don't have access to this meal");
                    return;
                }

                // Dish data.
                meal.dish = dish;

                res.statusCode = 200;
                res.send(meal);
            });
        });
    });
});

// POST - Create a meal.
router.post('/', function(req, res) {

    if (req.param('dishid') === null) {
        res.statusCode = 400;
        res.send("Missing params, can not add meal");
        return;
    }

    if (req.param('token') === null) {
        res.statusCode = 401;
        res.send('Wrong credentials');
        return;
    }

    // Getting userid from the token.
    TokenModel.findOne({token: req.param('token')}, function(error, token) {

        if (error) {
            res.statusCode = 500;
            res.send('Error getting token: ' + error);
            return;
        }

        if (!token) {
            res.statusCode = 401;
            res.send('Wrong credentials');
            return;
        }

        var meal = new MealModel({
            dishid : req.param('dishid'),
            userid : token.userid
        });

        // Check that the dish exists.
        DishModel.findById(meal.dishid, function(error, dish) {

            if (error) {
                res.statusCode = 500;
                res.send('Error getting dish: ' + error);
                return;
            }

            if (!dish) {
                res.statuscode = 400;
                res.send('Error, there is no such dish');
                return;
            }

            UserModel.findById(token.userid, function(error, user) {

                if (error) {
                    res.statusCode = 500;
                    res.send('Error getting user: ' + error);
                    return;
                }

                // This should NEVER happen.
                if (!user) {
                    res.statusCode = 500;
                    res.send("Error the user don't exist!");
                    return;
                }

                // Check that this user has not already booked this dish.
                var mealFilter = {userid : token.userid, dishid : dish.id};
                MealModel.findOne(mealFilter, function(error, userMeal) {

                    if (error) {
                        res.statusCode = 500;
                        res.send('Error getting meal' + error);
                        return;
                    }

                    if (userMeal) {
                        res.statusCode = 400;
                        res.send('This user already booked this dish');
                        return;
                    }

                    // Storing the meal.
                    meal.save(function(error) {

                        if (error) {
                            res.statusCode = 500;
                            res.send("Error saving meal: " + error);
                            return;
                        }

                        // Inform the chef about the new meal.
                        UserModel.findById(dish.userid, function(error, chef) {
                            if (error) {
                                res.statusCode = 500;
                                res.send('Error getting chef: ' + error);
                                return;
                            }

                            if (!chef) {
                                res.statuscode = 500;
                                res.send('Error, the user that cooked the dish does not exist anymore');
                                return;
                            }

                            // TODO This message should be language independent and frontend should get
                            // the i18n message according to the params we will attach here.
                            var msgdata = {
                                "message": user.name + " booked a " + dish.name + " dish! Remember to bring a lunchbox",
                                "type": "meal",
                                "dishid": dish.id
                            };

                            pusher.pushToGCM([chef.gcmregid], msgdata);

                            // Same output for all output formats.
                            res.statusCode = 200;
                            res.send(meal);
                        });
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
