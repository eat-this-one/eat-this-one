var LocationModel = require('../models/location.js').model;

function EatLocation(eat) {

    this.eat = eat;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        user : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        name : {
            validation : ['isNotEmpty', 'matches'],
            pattern : this.eat.getStringRegEx()
        }
    };
}

EatLocation.prototype.get = function() {

    // Here we accept by name and by _id.
    var filters = {};

    filters.name = this.eat.getParam('name', this.attrs.name.validation);
    if (filters.name === false) {
        // Let's try the id then.
        delete filters.name;
        filters._id = this.eat.getParam('id', this.attrs.id.validation);
        if (filters._id === false) {
            // Return if non of them is !empty and contains a valid value.
            return this.eat.returnCallback({
                code: 400,
                message: 'Bad request'
            });
        }
    }

    // We will store here the location.
    var loc = null;

    var checkMembershipCallback = function checkMembership(error, locData) {
        if (error) {
            if (error.code === 404) {
                return this.eat.returnCallback(null, [], 200);
            } else {
                return this.eat.returnCallback(error);
            }
        }
        loc = locData;
        this.eat.getEatLocationSubscription().isMember(error, loc._id, getMembersCallback);
    }.bind(this);

    var getMembersCallback = function getMembersCallback(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === false) {
            // Just the location data if it is not a member.
            return this.eat.returnCallback(null, [loc], 200);
        }

        // We also return all group members otherwise.
        var returnMembersCallback = function returnMembersCallback(error, members) {

            loc = loc.toJSON();
            loc.members = members;

            // Let's return it all, if error returnCallback just returns the error.
            // We return array to keep the get return array interface even though
            // we only allow fetching locations one by one.
            return this.eat.returnCallback(error, [loc], 200);

        }.bind(this);

        this.eat.getEatLocationSubscription().getMembers(error, loc, returnMembersCallback);

    }.bind(this);

    // If the user is enrolled in the location we will
    // also return the location members.
    this.fetchOne(null, filters, checkMembershipCallback);
};

EatLocation.prototype.add = function() {

    var loc = {
        user : this.eat.getUserid()
    };

    loc.name = this.eat.getParam('name', this.attrs.name.validation);
    if (loc.name === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Check that there is no location with the same name.
    var locationExistsCallback = function(error, existingLocations) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (existingLocations.length > 0) {
            return this.eat.returnCallback({code : 400, message : 'Location already exists'});
        }
        this.eat.getEatLocationSubscription().isMember(null, false, subscriptionExistsCallback);
    }.bind(this);

    // Check that the user is not already subscribed.
    var subscriptionExistsCallback = function(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === true) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Restricted to one group per user'
            });
        }

        // Save the user.
        return this.save(loc);
    }.bind(this);

    return this.fetch(null, {name : loc.name}, locationExistsCallback);
};

/**
 * @param {object} error
 * @param {object} filters
 * @param {arraycallback} callback
 */
EatLocation.prototype.fetch = function(error, filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    LocationModel.find(filters, function(error, locations) {
        if (error) {
            return callback(error);
        }

        return callback(null, locations);
    }.bind(this));
};

/**
 * @param {object} error
 * @param {object} filters
 * @param {objectCallback} callback
 */
EatLocation.prototype.fetchOne = function fetchOne(error, filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    var fetchLocationsCallback = function fetchLocationsCallback(error, locations) {
        if (error) {
            return callback(error);
        }
        if (locations.length === 0) {
            return callback({
                code: 404,
                message : 'Not found'
            });
        }

        var loc = locations[0];
        return callback(null, loc);

    }.bind(this);

    this.fetch(null, filters, fetchLocationsCallback);
};

/**
 * @private
 */
EatLocation.prototype.save = function(locationData, callback) {

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
            user : this.eat.getUserid(),
            loc : loc._id
        };

        // We overwrite the default callback as we need to send the location object.
        var locSubscriptionCallback = function(error, subscription) {
            if (error) {
                return callback(error);
            }

            return callback(null, loc, 201);
        }.bind(this);

        return this.eat.getEatLocationSubscription().save(locSubscription, locSubscriptionCallback);
    }.bind(this));
};

module.exports = EatLocation;
