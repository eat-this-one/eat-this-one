var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

function EatLocationSubscription(eat) {

    this.eat = eat;

    // Lazy load.
    this.eatLocation = null;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        locationid : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        userid : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    };
}

EatLocationSubscription.prototype.get = function() {

    var subscriptionsCallback = function(error, subscriptions) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        var locationsCallback = function(error, locations) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            return this.eat.returnCallback(null, locations, 200);
        }.bind(this);

        return this.getEatLocation().fetch({_id: { $in: subscriptions}}, locationsCallback);
    }.bind(this);

    return this.fetch({userid : this.eat.getUserid()}, subscriptionsCallback);
};

EatLocationSubscription.prototype.add = function() {

    var subscription = {
        locationid : this.eat.getParam(
            'locationid',
            this.attrs.locationid.validation
        ),
        userid : this.eat.getUserid()
    };

    var subscribedLocation = null;

    var subscriptionExistsCallback = function(error) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        // We need to overwrite as we need to forward the location.
        var saveCallback = function(error) {
            if (error) {
                return this.eat.returnCallback(error);
            }

            return this.eat.returnCallback(null, subscribedLocation, 201);
        }.bind(this);

        return this.save(subscription, saveCallback);
    }.bind(this);

    var locExistsCallback = function(error, locations) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        if (locations.length === 0) {
            return this.eat.returnCallback({
                code : 400,
                message : 'This location does not exist'
            });
        }

        // We store it as it is what we need to send back.
        subscribedLocation = locations[0];

        return this.checkIsNotSubscribed(subscription.userid, subscriptionExistsCallback);
    }.bind(this);

    return this.getEatLocation().fetch({_id : subscription.locationid}, locExistsCallback);

};

EatLocationSubscription.prototype.checkIsNotSubscribed = function(userid, callback) {

    // To avoid checking it again in callbacks.
    var localCallback = function(error, subscriptions) {
        if (error) {
            return callback(error);
        }
        if (subscriptions.length > 0) {
            return callback({
                code : 400,
                message : 'Restricted to one group per user'}
            );
        }
        return callback(null);
    }.bind(this);
    return this.fetch({userid : userid}, localCallback);
};

/**
 * @private
 */
EatLocationSubscription.prototype.save = function(subscription, callback) {

    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    var locSubscription = new LocationSubscriptionModel(subscription);
    locSubscription.save(function(error) {
        if (error) {
            return callback(error);
        }
        return callback(null, locSubscription, 201);
    }.bind(this));
};

/**
 * @private
 */
EatLocationSubscription.prototype.fetch = function(filters, callback) {

    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    LocationSubscriptionModel.find(filters, function(error, subscriptions) {
        if (error) {
            return callback(error);
        }
        return callback(null, subscriptions);
    }.bind(this));
};

EatLocationSubscription.prototype.getEatLocation = function() {
    if (this.eatLocation === null) {
        var EatLocation = require('./EatLocation.js');
        this.eatLocation = new EatLocation(this.eat);
    }
    return this.eatLocation;
};

module.exports = EatLocationSubscription;
