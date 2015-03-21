var LocationSubscriptionModel = require('../models/locationSubscription.js').model;

function EatLocationSubscription(eat) {

    this.eat = eat;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        userid : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        locationid : {
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

        var subscriptionIds = [];
        subscriptions.forEach(function(subscription) {
            subscriptionIds.push(subscription.loc);
        });
        return this.eat.getEatLocation().fetch(null, {_id: { $in: subscriptionIds}}, locationsCallback);
    }.bind(this);

    return this.fetch({user : this.eat.getUserid()}, subscriptionsCallback);
};

EatLocationSubscription.prototype.add = function() {

    // Subscription object
    var subscription = {
        user : this.eat.getUserid()
    };
    subscription.loc = this.eat.getParam(
        'locationid',
        this.attrs.locationid.validation
    );
    if (subscription.loc === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Set the location data to a wider scope so other
    // callbacks can reuse it.
    var subscribedLocation = null;

    // Check that the location does exist.
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

        return this.isMember(null, false, subscriptionExistsCallback);
    }.bind(this);

    // Check that the user has no subscriptions.
    var subscriptionExistsCallback = function(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === true) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Restricted to one group per user'
            });
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

    return this.eat.getEatLocation().fetch(null, {_id : subscription.loc}, locExistsCallback);

};

EatLocationSubscription.prototype.isMember = function isMember(error, locationid, callback) {
    if (error) {
        return callback(error);
    }

    var memberCallback = function memberCallback(error, subscriptions) {
        if (error) {
            return callback(error);
        } else if (subscriptions.length === 0) {
            return callback(null, false);
        } else {
            return callback(null, true);
        }
    }.bind(this);

    // If no locationid provided we check if it is member of any group.
    var filter = {user: this.eat.getUserid()};
    if (this.eat.hasValue(locationid)) {
        filter.loc = locationid;
    }
    this.fetch(filter, memberCallback);
};

EatLocationSubscription.prototype.getMembers = function getMembers(error, locationid, callback) {
    if (error) {
        return callback(error);
    }

    var getDeliveriesCallback = function getDeliveriesCallback(error, members) {
        if (error) {
            return callback(error);
        }

        if (members.length === 0) {
            return callback(null, []);
        }

        var membersIds = [];
        members.forEach(function(member) {
            membersIds.push(member.user._id);
        });

        var countDeliveriesCallback = function countDeliveriesCallbacks(error, counts) {
            if (error) {
                return callback(error);
            }

            for (var mi in members) {
                // We need to add stuff here.
                members[mi] = members[mi].toJSON();

                // The points are only the number of booked dishes.
                members[mi].user.points = counts[members[mi].user._id];
            }

            // Clean member's sensitive data.
            // We don't want people to know each other's info.
            var cleanMembers = [];
            for (var i in members) {
                members[i].user = this.eat.getEatUser().clearPersonalData(members[i].user);
                cleanMembers.push(members[i]);
            }
            return callback(error, cleanMembers);

        }.bind(this);

        this.eat.getEatMeal().countUsersDeliveredMeals(null, membersIds, countDeliveriesCallback);

    }.bind(this);

    // Get the location members.
    LocationSubscriptionModel
        .find({loc: locationid})
        .populate('user')
        .exec(getDeliveriesCallback.bind(this));
};

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

module.exports = EatLocationSubscription;
