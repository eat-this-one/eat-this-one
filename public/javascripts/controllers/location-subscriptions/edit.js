angular.module('eat-this-one')
    .controller('LocationSubscriptionsEditController', ['$scope', '$http', '$window', 'appStatus', 'eatConfig', 'authManager', 'notifier', 'newLocationRequest', 'newLocationSubscriptionRequest', 'locationSubscriptionsRequest', 'newLogRequest', function($scope, $http, $window, appStatus, eatConfig, authManager, notifier, newLocationRequest, newLocationSubscriptionRequest, locationSubscriptionsRequest, newLogRequest) {

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
        label: $scope.lang.wherelunch,
        placeholder: $scope.lang.whereexample,
        value: ''
    };

    $scope.address = {
        name: 'address',
        label: $scope.lang.address,
        placeholder: $scope.lang.addressexample,
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
        notifier.show($scope.lang.alreadysubscribed, $scope.lang.subscribedlocationinfo, 'success');

        newLogRequest('redirected', 'index', 'locationSubscriptions-edit');
        $window.location.href = 'index.html';
    }

    // We will redirect to home if the user already have a location subscription.
    appStatus.waiting('locationSubscriptionsRequest');
    locationSubscriptionsRequest($scope);

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

        if ($scope.loc.value != '') {
            // Only a subscription as the location already exists.
            appStatus.waiting('newLocationSubscriptionRequest');
            newLocationSubscriptionRequest($scope, $scope.loc.value);
        } else {
            // A new location including subscription.
            appStatus.waiting('newLocationRequest');
            newLocationRequest($scope, $scope.locationname.value, $scope.address.value);
        }

        newLogRequest('click', 'locationSubscription-add-confirm');
    };

}]);
