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
        userid : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    };
}

EatMeal.prototype.add = function() {

    var meal = new MealModel({
        dishid : this.eat.getParam(
            'dishid',
            this.attrs.dishid.validation,
            this.attrs.dishid.pattern
        ),
        userid : this.eat.getUserid()
    });

    // Dish data.
    var dish = null;

    // Here we will check that the dish exists.
    var dishCallback = function(error, dishes) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        if (dishes.length === 0) {
            return this.eat.returnCallback({
                code : 400,
                message : 'The dish does not exist'
            });
        }

        // Fill the required dish data.
        dish = dishes[0];

        var subscriptionFilter = {
            userid : meal.userid,
            locationid : dish.locationid
        };

        this.eat.getEatLocationSubscription().fetch(subscriptionFilter, subscriptionCallback);
    }.bind(this);

    // Here we will check that the user is subscribed to the dish location.
    var subscriptionCallback = function(error, subscription) {

        var alreadyBookedFilter = {
            userid : meal.userid,
            dishid : dish._id
        }
        this.fetch(alreadyBookedFilter, addMealCallback);
    }.bind(this);

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
    this.eat.getEatDish().fetch({_id : meal.dishid}, dishCallback);
};

EatMeal.prototype.getByUser = function() {
    var filters = {
        userid : this.eat.getUserid()
    };

    // Specific fetch as we will populate the dishes.
    MealModel.find({userid : this.eat.getUserid()}).populate('dishid').exec(function(error, meals) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // If there are no meals no need to look for dishes.
        if (meals.length === 0) {
            return this.eat.returnCallback(null, [], 200);
        }

        var dishes = [];
        meals.forEach(function(dish) {
            dishes.push(meal.dishid);
        })

        return this.eat.returnCallback(null, dishes, 200);
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
                "message": user.name + " booked a " + dish.name + " dish! Remember to bring a lunchbox",
                "type": "meal",
                "dishid": dish._id
            };
            pusher.pushToGCM([chef.gcmregid], msgdata);

            return this.eat.returnCallback(null, meal, 201);

        }.bind(this);

        // Inform the chef.
        this.eat.getEatUser().fetch({_id : dish.userid}, chefCallback);

    }.bind(this));
};

module.exports = EatMeal;
