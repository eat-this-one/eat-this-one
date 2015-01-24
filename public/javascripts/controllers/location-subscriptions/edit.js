angular.module('eat-this-one')
    .controller('LocationSubscriptionsEditController', ['$scope', '$http', 'redirecter', 'appStatus', 'eatConfig', 'authManager', 'notifier', 'formsManager', 'newLocationRequest', 'newLocationSubscriptionRequest', 'locationSubscriptionsRequest', 'newLogRequest', function($scope, $http, redirecter, appStatus, eatConfig, authManager, notifier, formsManager, newLocationRequest, newLocationSubscriptionRequest, locationSubscriptionsRequest, newLogRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.location;

    // To store the id.
    // TODO We really need to change all this shit.
    $scope.loc = {
        value: ''
    };
    $scope.locationname = {
        name: 'loc',
        label: $scope.lang.codeornew,
        placeholder: $scope.lang.whereexample,
        validation: ['required', 'text'],
        value: ''
    };

    $scope.address = {
        name: 'address',
        label: $scope.lang.address,
        placeholder: $scope.lang.addressexample,
        validation: ['required'],
        value: ''
    };

    // Initially hidden, we show the address box once the user
    // starts to type in the location box.
    $scope.showAddress = false;

    // If the user selects an existing location we disable the
    // address input as we don't want the to user spend time on it.
    $scope.disableAddress = false;

    newLogRequest('view', 'locationSubscriptions-add');

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

    // TODO We should use a cache for the system
    // locations; this is too expensive.
    $scope.getLocations = function(value) {

        // We need all the location data.
        var locations = [];

        // We show the address box until an
        // existing location is selected.
        $scope.showAddress = true;

        // Sending the request without requiring the
        // name to match exactly the provided value.
        return $http.get(eatConfig.backendUrl + '/locations', {
            params: {
                name: value,
                regex: 1
            }
        }).then(function(res) {
            angular.forEach(res.data, function(item) {
                locations.push(item);
            });
            return locations;
        });
    };

    $scope.getAddresses = function(value) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: value,
                sensor: false
            }
        }).then(function(res){
            var addresses = [];
            angular.forEach(res.data.results, function(item){
                addresses.push(item.formatted_address);
            });
            return addresses;
        });
    };

    // Runs when an existing location is selected.
    // Fills the address with the location address.
    $scope.fillAddress = function($item, $model, $label) {

        $scope.address.value = $item.address;
        $scope.disableAddress = true;

        // We save the locationid.
        $scope.loc.value = $item._id;
    };

    $scope.subscribe = function() {

        if ($scope.loc.value != '' &&
                $scope.loc.value != null &&
                typeof $scope.loc.value !== 'undefined') {

            if (!formsManager.validate(['loc'], $scope)) {
                return;
            }
            // Only a subscription as the location already exists.
            appStatus.waiting('newLocationSubscriptionRequest');

            var locSubscriptionCallback = function(data) {

                // TODO Here we should change the message depending on created/joined.
                notifier.show($scope.lang.joined, $scope.lang.joinedgroupinfo, function() {
                    // Cache the location.
                    localStorage.setItem('loc', JSON.stringify(data));
                    redirecter.redirect('index.html');
                });
            };
            var errorCallback = function(data, errorStatus, errorMsg) {
                appStatus.completed('newLocationSubscriptionRequest');
                notifier.show($scope.lang.error, data);
            };
            newLocationSubscriptionRequest($scope, $scope.loc.value, locSubscriptionCallback, errorCallback);

        } else {

            if (!formsManager.validate(['locationname', 'address'], $scope)) {
                return;
            }

            // A new location including subscription.
            appStatus.waiting('newLocationRequest');

            var locationCallback = function(data) {

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
            newLocationRequest($scope, $scope.locationname.value, $scope.address.value, locationCallback, errorCallback);
        }

        newLogRequest('click', 'locationSubscription-add-confirm');
    };

}]);
