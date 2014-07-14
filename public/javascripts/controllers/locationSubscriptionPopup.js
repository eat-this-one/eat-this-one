angular.module('eat-this-one').controller('locationSubscriptionPopupController', ['$scope', '$modalInstance', 'eatConfig', 'appStatus', 'newLocationRequest', 'newLocationSubscriptionRequest', function($scope, $modalInstance, eatConfig, appStatus, newLocationRequest, newLocationSubscriptionRequest) {

    $scope.lang = $.eatLang.lang;

    // Here we add locationid to fill it in case
    // the user selects an existing location.
    $scope.loc = {
        name: 'loc',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: '',
        locationid : null
    };

    $scope.address = {
        name: 'address',
        label: $scope.lang.address,
        placeholder: $scope.lang.address,
        value: ''
    };

    $scope.subscribe = function() {

        appStatus.waiting();

        if ($scope.loc.locationid !== null) {
            // Only a subscription as the location already exists.
            newLocationSubscriptionRequest($modalInstance, $scope.loc.locationid);
        } else {
            // A new location including subscription.
            newLocationRequest($modalInstance, $scope.loc.value, $scope.address.value);
        }
    };

}]);
