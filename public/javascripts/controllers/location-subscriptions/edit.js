angular.module('eat-this-one')
    .controller('LocationSubscriptionsEditController', ['$scope', '$http', 'redirecter', 'appStatus', 'eatConfig', 'authManager', 'notifier', 'formsManager', 'newLocationRequest', 'newLocationSubscriptionRequest', 'locationSubscriptionsRequest', 'newLogRequest', 'locationRequest', 'menuManager', function($scope, $http, redirecter, appStatus, eatConfig, authManager, notifier, formsManager, newLocationRequest, newLocationSubscriptionRequest, locationSubscriptionsRequest, newLogRequest, locationRequest, menuManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.location;
    $scope.actionIcons = [
        {
            name : $scope.lang.continue,
            icon : 'glyphicon glyphicon-arrow-right',
            callback : 'subscribe'
        }
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    // By default to join a group.
    $scope.usedfield = 'joingroup';

    // To store the id.
    // TODO We really need to change all this shit.
    $scope.loc = {
        value: ''
    };
    $scope.joingroup = {
        name: 'joingroup',
        label: $scope.lang.insertgroupcode,
        placeholder: $scope.lang.joingroupexample,
        validation: ['required', 'text'],
        value: ''
    };
    $scope.newgroup = {
        name: 'newgroup',
        label: $scope.lang.setgroupname,
        placeholder: $scope.lang.newgroupexample,
        validation: ['required', 'text'],
        value: ''
    };

    // If there is already one redirect home.
    if (localStorage.getItem('loc')) {
        notifier.show($scope.lang.alreadyjoined, $scope.lang.joinedgroupinfo, function() {
            newLogRequest('redirected', 'index', 'locationSubscriptions-edit');
            redirecter.redirect('index.html');
        });
    }

    // We will redirect to home if the user already have a location subscription.
    appStatus.waiting('locationSubscriptionsRequest');
    var locationSubscriptionsCallback = function(data) {

        appStatus.completed('locationSubscriptionsRequest');

        // Just one location subscription per user.
        if (data && data.length > 0) {

            // It returns an array, but should only contain 1 location subscription.
            localStorage.setItem('loc', JSON.stringify(data.shift()));

            // TODO Change this, only works in mobile.
            document.addEventListener('deviceready', function() {
                newLogRequest('redirected', 'index', 'locationSubscriptions-edit');
                notifier.show($scope.lang.alreadyjoined, $scope.lang.joinedgroupinfo, function() {
                    redirecter.redirect('index.html');
                });
            });
        }
    };
    var errorCallback = function(data, errorStatus, errorMsg) {
        appStatus.completed('locationSubscriptionsRequest');
        // No subscriptions expected.
    };
    locationSubscriptionsRequest($scope, locationSubscriptionsCallback, errorCallback);

    // Continue button clicked.
    $scope.subscribe = function() {

        newLogRequest('click', 'locationSubscription-add-confirm');

        if (!formsManager.validate([$scope.usedfield], $scope)) {
            return;
        }

        if ($scope.usedfield === 'joingroup') {

            appStatus.waiting('newLocationSubscriptionRequest');

            // Checking that the location exists.
            var locCallback = function(locationsData) {

                // We looked for an exact match before, so only 1 group should match.
                locationid = locationsData[0]._id;

                // If it exists add a new subscription to the location.
                var locSubscriptionCallback = function(data) {
                    appStatus.completed('newLocationSubscriptionRequest');
                    notifier.show($scope.lang.joined, $scope.lang.joinedgroupinfo, function() {
                        // Cache the location.
                        localStorage.setItem('loc', JSON.stringify(data));
                        redirecter.redirect('index.html');
                    });
                };
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newLocationSubscriptionRequest');
                    notifier.show($scope.lang.error, errorMsg);
                };
                newLocationSubscriptionRequest($scope, locationid, locSubscriptionCallback, errorCallback);
            };

            // If the location does not exists we notify the user about it.
            var noLocationErrorCallback = function(data, errorStatus, errorMsg) {
                appStatus.completed('newLocationSubscriptionRequest');
                notifier.show($scope.lang.locationnoexists, $scope.lang.locationnoexistsinfo);
            };
            locationRequest($scope, $scope.joingroup.value, locCallback, noLocationErrorCallback);

        } else {

            // TODO Check that the location name does not exist.
            // Probably this checking could be shared with the upper
            // condition.

            // A new location including subscription.
            appStatus.waiting('newLocationRequest');

            var locExistsCallback = function(data) {
                // Pity, notify the user that the location already exists.
                appStatus.completed('newLocationRequest');
                notifier.show($scope.lang.locationexists, $scope.lang.locationexistsinfo);
            };
            var noLocationCallback = function(data, errorStatus, errorMessage) {

                // Ok, if it does not exist we add the new location.
                var locationCallback = function(data) {
                    appStatus.completed('newLocationRequest');
                    var msg = $scope.lang.locationcreatedinfo + "\n\n" + $scope.lang.joinedgroupinfo;
                    notifier.show($scope.lang.locationcreated, msg, function() {
                        // Cache the location.
                        localStorage.setItem('loc', JSON.stringify(data));
                        redirecter.redirect('index.html');
                    });
                };
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newLocationRequest');
                    var msg = '"' + errorStatus + '": ' + data;
                    notifier.show($scope.lang.error, msg);
                };
                newLocationRequest($scope, $scope.newgroup.value, locationCallback, errorCallback);
            };
            locationRequest($scope, $scope.newgroup.value, locExistsCallback, noLocationCallback);
        }
    };

}]);
