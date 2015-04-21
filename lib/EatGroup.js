var log = require('./log.js');

var GroupModel = require('../models/group.js').model;

function EatGroup(eat) {

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
        },
        code : {
            validation : ['isNotEmpty', 'matches'],
            pattern : this.eat.getStringRegEx()
        },
        country : {
            validation : ['isNotEmpty', 'isAlpha']
        }
    };
}

EatGroup.prototype.get = function() {

    // Here we accept by name, code and by _id.
    var filters = {};

    // Try the name.
    filters.name = this.eat.getParam('name', this.attrs.name.validation);
    if (filters.name === false) {
        // Try the code then.
        delete filters.name;
        filters.code = this.eat.getParam('code', this.attrs.code.validation);
        if (filters.code === false) {
            // Try the _id then.
            delete filters.code;
            filters._id = this.eat.getParam('id', this.attrs.id.validation);
            if (filters._id === false) {
                // Return if non of them is !empty and contains a valid value.
                return this.eat.returnCallback({
                    code: 400,
                    message: 'Bad request'
                });
            }
        }
    }

    // We will store here the group.
    var group = null;

    var checkMembershipCallback = function checkMembership(error, groupData) {
        if (error) {
            if (error.code === 404) {
                return this.eat.returnCallback(null, [], 200);
            } else {
                return this.eat.returnCallback(error);
            }
        }
        group = groupData;
        this.eat.getEatGroupMember().isMember(error, group._id, getMembersCallback);
    }.bind(this);

    var getMembersCallback = function getMembersCallback(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === false) {
            // Just the group data if it is not a member.
            return this.eat.returnCallback(null, [group], 200);
        }

        // We also return all group members otherwise.
        var returnMembersCallback = function returnMembersCallback(error, members) {

            group = group.toJSON();
            group.members = members;

            // Let's return it all, if error returnCallback just returns the error.
            // We return array to keep the get return array interface even though
            // we only allow fetching groups one by one.
            return this.eat.returnCallback(error, [group], 200);

        }.bind(this);

        this.eat.getEatGroupMember().getMembers(error, group, returnMembersCallback);

    }.bind(this);

    // If the user is enrolled in the group we will
    // also return the group members.
    this.fetchOne(null, filters, checkMembershipCallback);
};

EatGroup.prototype.add = function() {

    var group = {
        user : this.eat.getUserid()
    };

    group = this.eat.fillWithReqParams(group, this.attrs, ['name', 'country']);
    if (group === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Check that there is no group with the same name.
    var groupExistsCallback = function(error, existingGroups) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (existingGroups.length > 0) {
            return this.eat.returnCallback({code : 400, message : 'Group already exists'});
        }
        this.eat.getEatGroupMember().isMember(null, false, membershipExistsCallback);
    }.bind(this);

    // Check that the user is not already a member.
    var membershipExistsCallback = function(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === true) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Restricted to one group per user'
            });
        }

        // Generate a code for the group and once done
        // save the group + make the user a member.
        return this.setCode(error, group, this.save.bind(this));
    }.bind(this);

    return this.fetch(null, {name : group.name}, groupExistsCallback);
};

/**
 * Sets the code and returns the group with code.
 *
 * @param {object} error
 * @param {object} group
 * @param {objectCallback} callback
 */
EatGroup.prototype.setCode = function setCode(error, group, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    // To avoid infinite loops.
    var i = 0;
    var loopCallback = function loopCallback(error, groups) {
        if (error) {
            return callback(error);
        }
        if (groups.length === 0) {
            // Bingo!
            group.code = code;
            return callback(null, group);
        }

        i = i + 1;
        if (i > 99) {
            // If we couldn't find an empty spot in 100 intents
            // the app is a success and we need to increment this
            // to more than 100.
            log(
                'error',
                'Groups code limit reached, raise it',
                this.eat
            );
            return callback({
                error: 500,
                message: 'Congrats! You broke it, let the admin know, he will be happy'
            });
        }

        // New code and try again.
        code = this.generateCode(group.name);
        this.fetch(null, {code: code}, loopCallback.bind(this));
    }.bind(this);

    // Let's see if there is any group with this same random code.
    var code = this.generateCode(group.name);
    this.fetch(null, {code: code}, loopCallback);
};

/**
 * Removes all non A-Z characters and add a random number at the end.
 *
 * @param {string} group
 * @return {string} The code
 */
EatGroup.prototype.generateCode = function generateCode(name) {
    var code = name.toUpperCase().replace(/[^A-Z]/g, '');
    return code + Math.floor((Math.random() * 100) + 1);
};

/**
 * @param {object} error
 * @param {object} filters
 * @param {arrayCallback} callback
 */
EatGroup.prototype.fetch = function(error, filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    GroupModel.find(filters, function(error, groups) {
        if (error) {
            return callback(error);
        }

        return callback(null, groups);
    }.bind(this));
};

/**
 * @param {object} error
 * @param {object} filters
 * @param {objectCallback} callback
 */
EatGroup.prototype.fetchOne = function fetchOne(error, filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    var fetchGroupsCallback = function fetchGroupsCallback(error, groups) {
        if (error) {
            return callback(error);
        }
        if (groups.length === 0) {
            return callback({
                code: 404,
                message : 'Not found'
            });
        }

        var group = groups[0];
        return callback(null, group);

    }.bind(this);

    this.fetch(null, filters, fetchGroupsCallback);
};

/**
 * @private
 */
EatGroup.prototype.save = function(error, groupData, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    if (error) {
        return callback(error);
    }

    var group = new GroupModel(groupData);
    group.save(function(error) {
        if (error) {
            return callback(error);
        }

        // We auto join the user to the group.
        var groupMembership = {
            user : this.eat.getUserid(),
            group : group._id
        };

        // We overwrite the default callback as we need to send the group object.
        var groupMembershipCallback = function(error, membership) {
            if (error) {
                return callback(error);
            }

            return callback(null, group, 201);
        }.bind(this);

        return this.eat.getEatGroupMember().save(groupMembership, groupMembershipCallback);
    }.bind(this));
};

module.exports = EatGroup;
