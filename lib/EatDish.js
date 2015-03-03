var DishModel = require('../models/dish.js').model;
var PhotoModel = require('../models/photo.js').model;

function EatDish(eat) {

    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    }
}

EatDish.prototype.getByUser = function() {

    var subscriptionsFilters = {userid : this.eat.getUserid()};

    // Here we will get all dishes from the user location subscriptions.
    var subscriptionsCallback = function(error, subscriptions) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // As long as the user has an account it is an user so this is a 200.
        if (subscriptions.length === 0) {
            return this.eat.returnCallback(null, [], 200);
        }

        // In theory just 1 location subscription per user, but let's do
        // it for multiple locations as we will need it at some point.
        var locationIds = [];
        subscriptions.forEach(function(subscription) {
            locationIds.push(subscription.locationid);
        });

        // Fetch by location id and return them.
        var filters = {
            locationid : {
                $in : locationIds
            }, when : {
                $gt : this.eat.getYesterday()
            }
        };
        this.fetch(filters);

    }.bind(this);

    this.eat.getEatLocationSubscription().fetch(subscriptionsFilters, subscriptionsCallback);
};

EatDish.prototype.getById = function() {

    var id = this.eat.getParam('id', this.attrs.id.validation);

    // Specific query as we need to populate location and chef.
    DishModel.findById(id).populate('locationid').populate('userid').exec(function(error, dish) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        if (!dish) {
            return this.eat.returnCallback({
                code : 404,
                message : 'Not found'
            });
        }

        // TODO we will have to adapt all dishFormatter uses once we swithc to user instead of userid.
        var returnDish = {
            id : dish._id,
            locationid : dish.locationid._id,
            userid : dish.userid._id,
            loc : dish.locationid,
            user : {name : dish.userid.name},
            name : dish.name,
            description : dish.description,
            when : dish.when,
            nportions : dish.nportions,
            donation : dish.donation,
        };

        this.getDishExtraData(returnDish);

    }.bind(this));
};

EatDish.prototype.getDishExtraData = function(returnDish) {

    // Here we will get the number of booked meals.
    var bookedMealsCallback = function(error, bookedmeals) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // Has the current user booked this dish?
        returnDish.booked = false;
        bookedmeals.forEach(function(meal) {
            if (meal.userid === this.eat.getUserid()) {
                returnDish.booked = true;
                return;
            }
        });

        // Frontend will count the remaining portions.
        returnDish.bookedmeals = bookedmeals.length;

        // We need to get the photo data if there is any.
        if (!this.eat.hasValue(returnDish.photoid)) {
            // We just check the access and return the dish.
            return this.checkUserAccess(returnDish);
        } else {
            PhotoModel.findById(returnDish.photoid, function(error, photo) {
                if (error) {
                    return this.eat.returnCallback(error);
                }
                returnDish.photo = "data:image/jpeg;base64," + photo.data;

                // Check the access and return the dish.
                return this.checkUserAccess(returnDish);
            }.bind(this));
        }
    }.bind(this);

    // Get the dish meals and after that the photo if there is one.
    this.eat.getEatMeal().fetch({dishid : returnDish.id}, bookedMealsCallback);
};

EatDish.prototype.add = function() {
};

EatDish.prototype.update = function() {
};

EatDish.prototype.checkUserAccess = function(returnDish, callback) {

    // If no callback just finish.
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    var userAccessCallback = function(error, subscriptions) {
        if (error) {
            return callback(error);
        }
        var hasAccess = false;
        subscriptions.forEach(function(subscription) {
            if (returnDish.locationid.equals(subscription.locationid)) {
                hasAccess = true;
            }
        });

        if (hasAccess === false) {
            return callback({
                code : 401,
                message : 'No access'
            });
        }

        callback(null, returnDish);

    }.bind(this);

    this.eat.getEatLocationSubscription().fetch({userid : this.eat.getUserid()}, userAccessCallback);
};

EatDish.prototype.fetch = function(filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    // When getting dishes we force the order by time created.
    var extra = {sort : {'created' : -1}};
    DishModel.find(filters, {}, extra, function(error, dishes) {
        if (error) {
            return callback(error);
        }

        return callback(null, dishes);
    }.bind(this));
};

module.exports = EatDish;
