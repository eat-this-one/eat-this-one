angular.module('eat-this-one')
    .controller('LocationSubscriptionsEditController', ['$scope', '$http', 'redirecter', 'appStatus', 'eatConfig', 'authManager', 'notifier', 'formsManager', 'newLocationRequest', 'newLocationSubscriptionRequest', 'locationSubscriptionsRequest', 'newLogRequest', 'locationsRequest', 'menuManager', function($scope, $http, redirecter, appStatus, eatConfig, authManager, notifier, formsManager, newLocationRequest, newLocationSubscriptionRequest, locationSubscriptionsRequest, newLogRequest, locationsRequest, menuManager) {

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

    // We will redirect to home if the user already have a location subscription.
    appStatus.waiting('locationSubscriptionsRequest');
    var locationSubscriptionsCallback = function(data) {

        appStatus.completed('locationSubscriptionsRequest');

        // Just one location subscription per user.
        if (data.length > 0) {

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

            // If the location does not exists we notify the user about it.
            var noLocationErrorCallback = function(data, errorStatus, errorMsg) {
                appStatus.completed('newLocationSubscriptionRequest');
                notifier.show($scope.lang.locationnoexists, $scope.lang.locationnoexistsinfo);
            };

            // Checking that the location exists.
            var locCallback = function(locationsData) {

                // If the location does not exist will return data but length = 0.
                if (locationsData.length === 0) {
                    return noLocationErrorCallback(null, null, null);
                }

                // We should only have 1 result here.
                locationid = locationsData[0]._id;

                var locSubscriptionCallback = function(data) {
                    appStatus.completed('newLocationSubscriptionRequest');

                    // Cache the location.
                    localStorage.setItem('loc', JSON.stringify(data));

                    notifier.show($scope.lang.joined, $scope.lang.joinedgroupinfo, function() {
                        redirecter.redirect('index.html');
                    });
                };

                // New location subscription error.
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newLocationSubscriptionRequest');
                    notifier.show($scope.lang.error, $scope.lang.useralreadyingroup);
                };

                newLocationSubscriptionRequest($scope, locationid, locSubscriptionCallback, errorCallback);
            };

            locationsRequest($scope, $scope.joingroup.value, locCallback, noLocationErrorCallback);

        } else {

            // A new location including subscription.
            appStatus.waiting('newLocationRequest');

            var locExistsCallback = function(locations) {

                // If there are zero locations forward to noLocationCallback.
                if (locations.length === 0) {
                    noLocationCallback(locations);
                }

                // Pity, notify the user that the location already exists.
                appStatus.completed('newLocationRequest');
                notifier.show($scope.lang.locationexists, $scope.lang.locationexistsinfo);
            };

            var noLocationCallback = function(data, errorStatus, errorMessage) {

                // Ok, if it does not exist we add the new location.
                var locationCallback = function(data) {
                    appStatus.completed('newLocationRequest');

                    // Cache the location.
                    localStorage.setItem('loc', JSON.stringify(data));

                    var msg = $scope.lang.locationcreatedinfo + "\n\n" + $scope.lang.joinedgroupinfo;
                    notifier.show($scope.lang.locationcreated, msg, function() {
                        redirecter.redirect('index.html');
                    });
                };
                var errorCallback = function(data, errorStatus, errorMsg) {
                    appStatus.completed('newLocationRequest');
                    newLogRequest('error', 'location-add', errorMsg);
                    notifier.show($scope.lang.error, $scope.lang.weird, function() {
                        redirecter.redirect('index.html');
                    });
                };
                newLocationRequest($scope, $scope.newgroup.value, locationCallback, errorCallback);
            };
            locationsRequest($scope, $scope.newgroup.value, locExistsCallback, noLocationCallback);
        }
    };

}]);
