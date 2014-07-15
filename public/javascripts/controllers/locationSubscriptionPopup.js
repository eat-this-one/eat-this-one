angular.module('eat-this-one').controller('locationSubscriptionPopupController', ['$scope', '$modalInstance', 'eatConfig', 'appStatus', 'newLocationRequest', 'newLocationSubscriptionRequest', function($scope, $modalInstance, eatConfig, appStatus, newLocationRequest, newLocationSubscriptionRequest) {

    $scope.lang = $.eatLang.lang;

    // To store the id.
    // TODO We really need to change all this shit.
    $scope.loc = {
        value: ''
    };
    $scope.locationname = {
        name: 'loc',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: ''
    };

    $scope.address = {
        name: 'address',
        label: $scope.lang.address,
        placeholder: $scope.lang.address,
        value: ''
    };

    $scope.subscribe = function() {

        appStatus.waiting();

        if ($scope.loc.value != '') {
            // Only a subscription as the location already exists.
            newLocationSubscriptionRequest($modalInstance, $scope.loc.value);
        } else {
            // A new location including subscription.
            newLocationRequest($modalInstance, $scope.locationname.value, $scope.address.value);
        }
    };

}]);
