var GroupMemberModel = require('../models/groupmember.js').model;

var log = require('./log.js');

function EatGroupMember(eat) {

    this.eat = eat;

    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        userid : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        groupid : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    };
}

EatGroupMember.prototype.get = function() {

    var membershipsCallback = function(error, memberships) {
        if (error) {
            return this.eat.returnCallback(error);
        }

        var groupsCallback = function(error, groups) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            return this.eat.returnCallback(null, groups, 200);
        }.bind(this);

        var membershipIds = [];
        memberships.forEach(function(membership) {
            membershipIds.push(membership.group);
        });
        return this.eat.getEatGroup().fetch(null, {_id: { $in: membershipIds}}, groupsCallback);
    }.bind(this);

    return this.fetch({user : this.eat.getUserid()}, membershipsCallback);
};

EatGroupMember.prototype.add = function() {

    // Membership object
    var membership = {
        user : this.eat.getUserid()
    };
    membership.group = this.eat.getParam(
        'groupid',
        this.attrs.groupid.validation
    );
    if (membership.group === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    // Set the group data to a wider scope so other
    // callbacks can reuse it.
    var groupMembership = null;

    // Check that the group does exist.
    var groupExistsCallback = function(error, groups) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        if (groups.length === 0) {
            return this.eat.returnCallback({
                code : 400,
                message : 'This group does not exist'
            });
        }

        // We store it as it is what we need to send back.
        groupMembership = groups[0];

        return this.isMember(null, false, membershipExistsCallback);
    }.bind(this);

    // Check that the user has no memberships.
    var membershipExistsCallback = function(error, isMember) {
        if (error) {
            return this.eat.returnCallback(error);
        } else if (isMember === true) {
            return this.eat.returnCallback({
                code : 400,
                message : 'Restricted to one group per user'
            });
        }

        // We need to overwrite as we need to forward the group.
        var saveCallback = function(error) {
            if (error) {
                return this.eat.returnCallback(error);
            }
            // Notify the group members that there is a new membership.
            GroupMemberModel
                .find({group: groupMembership._id})
                .populate('user')
                .exec(function(error, memberships) {
                    if (error) {
                        // Just log it as the dish is already created.
                        log('error', 'We can not get ' + groupMembership._id + ' group members', this.eat, error);
                        return this.eat.returnCallback(null, groupMembership, 201);
                    }

                    if (memberships.length === 0) {
                        // Log it, this is weird...
                        log('error', 'No ' + groupMembership._id + ' group members', this.eat, error);
                        return this.eat.returnCallback(null, groupMembership, 201);
                    }

                    var users = [];
                    // We need to include the current user here to fallback
                    // to a simple message if the provided message is wrong.
                    memberships.forEach(function(membership) {
                        users.push(membership.user);
                    });

                    // We notify all the memberships that a new member joined.
                    var pusher = require('../lib/pusher.js');
                    pusher.sendNotifications(
                        this.eat,
                        users,
                        "newmember",
                        groupMembership._id,
                        "groups/view.html?id=" + groupMembership._id
                    );

                    // We don't need to wait for the push to finish, we can just return the result.
                    return this.eat.returnCallback(null, groupMembership, 201);
                }.bind(this));

        }.bind(this);

        return this.save(membership, saveCallback);
    }.bind(this);

    return this.eat.getEatGroup().fetch(null, {_id : membership.group}, groupExistsCallback);

};

EatGroupMember.prototype.remove = function remove() {
    var groupid = this.eat.getParam('id', this.attrs.groupid.validation);
    if (groupid === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    var filters = {user : this.eat.getUserid(), group : groupid};
    GroupMemberModel.remove(filters, function(error) {
        return this.eat.returnCallback(error, '', 200);
    }.bind(this));
};

EatGroupMember.prototype.isMember = function isMember(error, groupid, callback) {
    if (error) {
        return callback(error);
    }

    var memberCallback = function memberCallback(error, memberships) {
        if (error) {
            return callback(error);
        } else if (memberships.length === 0) {
            return callback(null, false);
        } else {
            return callback(null, true);
        }
    }.bind(this);

    // If no groupid provided we check if it is member of any group.
    var filter = {user: this.eat.getUserid()};
    if (this.eat.hasValue(groupid)) {
        filter.group = groupid;
    }
    this.fetch(filter, memberCallback);
};

EatGroupMember.prototype.getMembers = function getMembers(error, groupid, callback) {
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

    // Get the group members.
    GroupMemberModel
        .find({group: groupid})
        .populate('user')
        .exec(getDeliveriesCallback.bind(this));
};

EatGroupMember.prototype.fetch = function(filters, callback) {
    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    GroupMemberModel.find(filters, function(error, memberships) {
        if (error) {
            return callback(error);
        }
        return callback(null, memberships);
    }.bind(this));
};

/**
 * @private
 */
EatGroupMember.prototype.save = function(membership, callback) {

    if (typeof callback === 'undefined') {
        callback = this.eat.returnCallback.bind(this.eat);
    }

    var groupMembership = new GroupMemberModel(membership);
    groupMembership.save(function(error) {
        if (error) {
            return callback(error);
        }
        return callback(null, groupMembership, 201);
    }.bind(this));
};

module.exports = EatGroupMember;
