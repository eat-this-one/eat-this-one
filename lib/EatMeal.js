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

EatMeal.prototype.add = function() {

    var mealObj = {
        user : this.eat.getUserid()
    };

    mealObj.dish = this.eat.getParam(
        'dishid',
        this.attrs.dishid.validation,
        this.attrs.dishid.pattern
    );
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
        this.fetch(alreadyBookedFilter, addMealCallback);

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
    this.eat.getEatDish().fetchDish(meal.dish, dishCallback);
};

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

EatMeal.prototype.fetch = function(filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    MealModel.find(filters, function(error, meals) {
        if (error) {
            return callback(error);
        }

        return callback(null, meals);
    }.bind(this));
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
        var chefCallback = function(error, users) {
            if (error) {
                this.eat.returnCallback(error);
            }

            if (users.length === 0) {
                this.eat.returnCallback({
                    code : 404,
                    message : 'The chef is not available anymore'
                });
            }

            // Chef data.
            var chef = users[0];

            // TODO This message should be language independent and frontend should get
            // the i18n message according to the params we will attach here.
            var msgdata = {
                "message": dish.user.name + " booked a " + dish.name + " dish! Remember to bring a lunchbox",
                "type": "meal",
                "dishid": dish._id
            };
            pusher.pushToGCM(this.eat, [chef.gcmregid], msgdata);

            return this.eat.returnCallback(null, meal, 201);

        }.bind(this);

        // Inform the chef.
        this.eat.getEatUser().fetch({_id : dish.user}, chefCallback);

    }.bind(this));
};

module.exports = EatMeal;
