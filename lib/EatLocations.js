var LocationModel = require('../models/location.js').model;

function EatLocations(eat) {

    this.eat = eat;

    // Lazy load.
    this.eatLocationSubscription = null;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        userid : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        name : {
            validation : ['isNotEmpty', 'matches'],
            pattern : this.eat.getStringRegEx()
        }
    };
}

EatLocations.prototype.getByName = function() {
    var filters = {
        name : this.eat.getParam('name', this.attrs.name.validation)
    };
    return this.fetch(filters);
};

EatLocations.prototype.add = function() {

    var loc = {
        name : this.eat.getParam('name', this.attrs.name.validation),
        userid : this.eat.getUserid()
    };

    // Check that the user don't already have a subscription.
    var subscriptionExistsCallback = function(error) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        return this.save(loc);
    }.bind(this);

    // Let's check that there is no another location with the same name.
    var locationExistsCallback = function(error, existingLocations) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        if (existingLocations.length > 0) {
            return this.eat.returnCallback({code : 400, message : 'Location already exists'});
        }
        return this.getEatLocationSubscription().checkIsNotSubscribed(loc.userid, subscriptionExistsCallback);
    }.bind(this);

    return this.fetch({name : loc.name}, locationExistsCallback);
};

/**
 * @private
 */
EatLocations.prototype.save = function(locationData, callback) {

    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    var loc = new LocationModel(locationData);
    loc.save(function(error) {
        if (error) {
            return callback(error);
        }

        // We auto subscribe the user to the location.
        var locSubscription = {
            locationid : loc._id,
            userid : this.eat.getUserid()
        };

        // We overwrite the default callback as we need to send the location object.
        var locSubscriptionCallback = function(error, subscription) {
            if (error) {
                return callback(error);
            }

            return callback(null, loc, 201);
        }.bind(this);

        return this.getEatLocationSubscription().save(locSubscription, locSubscriptionCallback);
    }.bind(this));
};

/**
 * @private
 */
EatLocations.prototype.fetch = function(filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    LocationModel.find(filters, function(error, locations) {
        if (error) {
            return callback(error);
        }

        return callback(null, locations);
    }.bind(this));
};

EatLocations.prototype.getEatLocationSubscription = function() {
    if (this.eatLocationSubscription === null) {
        var EatLocationSubscriptions = require('./EatLocationSubscriptions.js');
        this.eatLocationSubscription = new EatLocationSubscriptions(this.eat);
    }
    return this.eatLocationSubscription;
};

module.exports = EatLocations;
