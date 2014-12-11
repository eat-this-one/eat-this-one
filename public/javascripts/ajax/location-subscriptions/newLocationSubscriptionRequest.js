angular.module('eat-this-one')
    .factory('newLocationSubscriptionRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, locationid) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/location-subscriptions',
            data : {
                locationid : locationid,
                token : sessionManager.getToken()
            }

        }).success(function(data) {

            notifier.show($scope.lang.subscribed, $scope.lang.subscribedlocationinfo, 'success');

            appStatus.completed();

            // Cache the location.
            localStorage.setItem('loc', JSON.stringify(data));

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            notifier.show($scope.lang.error, data, 'error');
        });
    };
}]);
