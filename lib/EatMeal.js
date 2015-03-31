var log = require('./log.js');

var MealModel = require('../models/meal.js').model;

var pusher = require('../lib/pusher.js');

function EatMeal(eat) {

    this.eat = eat;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        dishid : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        user : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    };
}

EatMeal.prototype.get = function() {

    // We only accept listing them by dishid.
    var filters = {
        dish : this.eat.getParam('dishid', this.attrs.dishid.validation)
    };
    if (filters.dish === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // We must check that the current user is the dish owner.
    var checkOwnerCallback = function checkOwnerCallback(error, isOwner) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        console.log('iswon:' + typeof isOwner +'='+isOwner);
        if (isOwner === false) {
            return this.eat.returnCallback({
                code: 401,
                message: 'Unauthorized'
            });
        }

        // Fetch and return.
        this.fetch(null, filters, true);
    }.bind(this);

    this.eat.getEatDish().checkIsOwnDish(null, filters.dish, checkOwnerCallback);
};

EatMeal.prototype.add = function() {

    var mealObj = {
        user : this.eat.getUserid()
    };

    mealObj.dish = this.eat.getParam('dishid', this.attrs.dishid.validation);
    if (mealObj.dish === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }
    var meal = new MealModel(mealObj);

    // Dish data.
    var dish = null;

    // Here we will check that the dish exists.
    var dishCallback = function(error, dishData) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        if (!dishData) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Unexisting dish'
            });
        }

        if (dishData.user === this.eat.getUserid()) {
            return this.eat.returnCallback({
                code : 400,
                message : 'You can not book your own dishes'
            });
        }

        // Copying the dish data to wider scope var so subscriptionCallback can read it.
        dish = dishData;

        var subscriptionFilter = {
            user : meal.user,
            loc : dish.loc._id
        };
        this.eat.getEatLocationSubscription().fetch(subscriptionFilter, subscriptionCallback);

    }.bind(this);

    // Here we will check that the user is subscribed to the dish location.
    var subscriptionCallback = function(error, subscriptions) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        if (subscriptions.length === 0) {
            return this.eat.returnCallback({
                code : 401,
                message : 'Not subscribed to this location'
            });
        }

        var alreadyBookedFilter = {
            user : meal.userid,
            dish : dish._id
        };
        this.fetch(null, alreadyBookedFilter, false, addMealCallback);

    }.bind(this);

    // Here we will check that the user has not already booked a meal.
    var addMealCallback = function(error, existingMeals) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        if (existingMeals.length > 0) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Already booked'
            });
        }

        return this.save(meal, dish);
    }.bind(this);

    // So let's do it.
    this.eat.getEatDish().fetchDish(meal.dish, true, dishCallback);
};

// TODO We are not using this one, think about removing it.
EatMeal.prototype.getByUser = function() {
    var filters = {
        user : this.eat.getUserid()
    };

    // Specific fetch as we will populate the dishes.
    MealModel.find(filters).populate('dish').exec(function(error, meals) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // If there are no meals no need to look for dishes.
        if (meals.length === 0) {
            return this.eat.returnCallback(null, [], 200);
        }

        return this.eat.returnCallback(null, meals, 200);
    }.bind(this));
};

// TODO If we accept multiple locations we should also
// filter by the location here.
EatMeal.prototype.countUsersDeliveredMeals = function(error, usersIds, callback) {
    if (error) {
        return callback(error);
    }

    this.eat.getEatDish().fetch({user: { $in : usersIds }}, function(error, dishes) {
        if (error) {
            return callback(error);
        }

        var userCounts = {};
        // Set them all to 0.
        for (var ui in usersIds) {
            userCounts[usersIds[ui]] = 0;
        }

        if (dishes.length === 0) {
            return callback(null, userCounts);
        }

        var dishesIds = [];
        var userDishes = {};  // Map to match later.
        dishes.forEach(function(dish) {
            dishesIds.push(dish._id);
            if (typeof userDishes[dish.user] === "undefined") {
                userDishes[dish.user] = {};
            }
            userDishes[dish.user][dish._id.toJSON()] = true;
        });

        // Now we get these filters counts.
        MealModel.aggregate([
            { $match :
                {
                    dish : { $in : dishesIds }
                }
            },
            { $group :
                {
                    _id : "$dish",
                    deliveries : { $sum : 1 }
                }
            }
        ]).exec(function(error, deliveries) {
            if (error) {
                return callback(error);
            }

            // Now match dishes and users.
            for (var di in deliveries) {
                for(var userid in userDishes) {
                    if (userDishes[userid].hasOwnProperty(deliveries[di]._id)) {
                        userCounts[userid] = userCounts[userid] + deliveries[di].deliveries;
                    }
                }
            }

            // Return each user counts.
            return callback(null, userCounts);
        }.bind(this.eat));


    }.bind(this));

};

/**
 * @param {boolean} populate
 */
EatMeal.prototype.fetch = function(error, filters, populate, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    if (populate === false) {
        MealModel.find(filters, function(error, meals) {
            if (error) {
                return callback(error);
            }
            return callback(null, meals);
        }.bind(this));

    } else {
        // We might want to populate dish in future too.
        MealModel.find(filters)
            .populate('user')
            .exec(function(error, meals) {
                if (error) {
                    return callback(error);
                }

                if (meals.length === 0) {
                    return callback(null, []);
                }

                // Clean users private stuff.
                var cleanMeals = [];
                for (var i in meals) {
                    meals[i] = meals[i].toJSON();
                    meals[i].user = this.eat.getEatUser().clearPersonalData(meals[i].user);
                    cleanMeals.push(meals[i]);
                }

                return callback(null, cleanMeals);
            }.bind(this));
    }
};

/**
 * @private
 */
EatMeal.prototype.save = function(meal, dish) {

    meal.save(function(error) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // Here we will inform the chef that someone booked a dish.
        var currentUserCallback = function(error, users) {
            if (error) {
                return this.eat.returnCallback(error);
            }

            if (users.length === 0) {
                return this.eat.returnCallback({
                    code : 404,
                    message : 'The current user can not be obtained'
                });
            }

            // Chef data.
            var currentUser = users[0];

            // Set the message.
            var message = this.eat.getParam('message',
                ['isNotEmpty', 'matches'],
                this.eat.getStringRegEx()
            );
            // If it is not clean (it shouldn't) fallback to user and dish.
            if (message === false) {
                // TODO Once all tested change this to just a log
                // of the user. This is supposed to not happen, only
                // i18n errors.
                log('error', 'wrong message',
                    this.eat, this.eat.req.param('message'));
                message = currentUser.name + ' - ' + dish.name;
            }

            var msgdata = {
                "message": message,
                "from" : currentUser.name,
                "type": "newmeal",
                "dishid": dish._id.valueOf()
            };

            // GCM notification.
            if (typeof dish.user.gcmregid !== "undefined") {
                pusher.pushToGCM(this.eat, [dish.user.gcmregid], msgdata);
            } else if(typeof dish.user.apntoken !== "undefined") {
                pusher.pushToAPN(this.eat, [dish.user.apntoken], msgdata);
            }

            return this.eat.returnCallback(null, meal, 201);

        }.bind(this);

        // Get the current user data in case the message is wrong.
        this.eat.getEatUser().fetch({_id : this.eat.getUserid()}, currentUserCallback);

    }.bind(this));
};

module.exports = EatMeal;
