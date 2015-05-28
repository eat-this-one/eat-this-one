angular.module('eat-this-one')
    .controller('GroupMembersEditController', ['$scope', '$http', 'redirecter', 'appStatus', 'eatConfig', 'authManager', 'notifier', 'formsManager', 'newGroupRequest', 'newGroupMemberRequest', 'groupMembersRequest', 'newLogRequest', 'groupsRequest', 'menuManager', 'statics',
    function($scope, $http, redirecter, appStatus, eatConfig, authManager, notifier, formsManager, newGroupRequest, newGroupMemberRequest, groupMembersRequest, newLogRequest, groupsRequest, menuManager, statics) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.setgroup;
    $scope.actionIcons = [
        {
            name : $scope.lang.continue,
            icon : 'glyphicon glyphicon-arrow-right',
            callback : 'addMember'
        }
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    if (!$scope.auth.isAuthenticated()) {
        redirecter.redirect('index.html');
    }

    // By default to join a group.
    $scope.usedfield = 'joingroup';

    // To store the id.
    // TODO We really need to change all this shit.
    $scope.group = {
        value: ''
    };
    $scope.joingroup = {
        name: 'joingroup',
        label: $scope.lang.insertgroupcode,
        placeholder: $scope.lang.joingroupexample,
        infodelay: 2000,
        validation: ['required', 'text'],
        value: ''
    };
    $scope.newgroup = {
        name: 'newgroup',
        label: $scope.lang.setgroupname,
        placeholder: $scope.lang.newgroupexample,
        infodelay: 2000,
        validation: ['required', 'text'],
        value: ''
    };
    $scope.country = {
        name: 'country',
        label: $scope.lang.setcountry,
        validation: ['required', 'text'],
        value: localStorage.getItem('country'),
        options : statics.getCountriesOptions()
    };

    // We will redirect to home if the user already have a group membership.
    appStatus.waiting('groupMembersRequest');
    var groupMembersCallback = function(data) {

        appStatus.completed('groupMembersRequest');

        // Just one group membership per user.
        if (data.length > 0) {

            // It returns an array, but should only contain 1 group membership.
            localStorage.setItem('group', JSON.stringify(data.shift()));

            newLogRequest('redirected', 'index', 'groupMembers-edit');
            notifier.show($scope.lang.alreadyjoined, $scope.lang.joinedgroupinfo, function() {
                redirecter.redirect('index.html');
            });
        }
    };
    var errorCallback = function(data, errorStatus, errorMsg) {
        appStatus.completed('groupMembersRequest');
        // No memberships expected although in theory it will return an empty array.
    };
    groupMembersRequest($scope, groupMembersCallback, errorCallback);

    // Continue button clicked.
    $scope.addMember = function() {

        newLogRequest('click', 'groupMember-add-confirm');

        if (!formsManager.validate([$scope.usedfield], $scope)) {
            notifier.show($scope.lang.missingfields, $scope.lang.missingfieldsinfo);
            return;
        }

        if ($scope.usedfield === 'joingroup') {

            appStatus.waiting('newGroupMemberRequest');

            // If the group does not exists we notify the user about it.
            var noGroupErrorCallback = function(data, errorStatus, errorMsg) {
                appStatus.completed('newGroupMemberRequest');
                notifier.show($scope.lang.wrongcode, $scope.lang.wrongcodeinfo);
            };

            // Checking that the group exists.
            var groupCallback = function(groupsData) {

                // If the group does not exist will return data but length = 0.
                if (groupsData.length === 0) {
                    return noGroupErrorCallback(null, null, null);
                }

                // We should only have 1 result here.
                groupid = groupsData[0]._id;

                var groupMembershipCallback = function(data) {
                    appStatus.completed('newGroupMemberRequest');

                    // Cache the group.
                    localStorage.setItem('group', JSON.stringify(data));

                    notifier.show($scope.lang.welcome, $scope.lang.joinedgroupinfo, function() {
                        redirecter.redirect('index.html');
                    });
                };

                // New group membership error.
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newGroupMemberRequest');
                    notifier.show($scope.lang.error, $scope.lang.useralreadyingroup);
                };

                newGroupMemberRequest($scope, groupid, groupMembershipCallback, errorCallback);
            };

            groupsRequest($scope, {code: $scope.joingroup.value}, groupCallback, noGroupErrorCallback);

        } else {

            // A new group including membership.
            appStatus.waiting('newGroupRequest');

            var groupExistsCallback = function(groups) {

                // If there are zero groups forward to noGroupCallback.
                if (groups.length === 0) {
                    noGroupCallback(groups);
                } else {
                    // Pity, notify the user that the group already exists.
                    appStatus.completed('newGroupRequest');
                    notifier.show($scope.lang.groupexists, $scope.lang.groupexistsinfo);
                }
            };

            var noGroupCallback = function(data, errorStatus, errorMessage) {

                // Ok, if it does not exist we add the new group.
                var groupCallback = function(data) {
                    appStatus.completed('newGroupRequest');

                    // Cache the group.
                    localStorage.setItem('group', JSON.stringify(data));

                    notifier.show($scope.lang.groupcreated, $scope.lang.groupcreatedinfo, function() {
                        redirecter.redirect('index.html');
                    });
                };
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newGroupRequest');
                    newLogRequest('error', 'group-add', errorMsg);
                    notifier.show($scope.lang.error, $scope.lang.weird, function() {
                        redirecter.redirect('index.html');
                    });
                };
                newGroupRequest($scope, $scope.newgroup.value, $scope.country.value, groupCallback, errorCallback);
            };
            groupsRequest($scope, {name: $scope.newgroup.value}, groupExistsCallback, noGroupCallback);
        }
    };

}]);
