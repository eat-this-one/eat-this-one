angular.module('eat-this-one')
    .factory('locationSubscriptionsRequest', ['$http', '$window', 'appStatus', 'eatConfig', 'sessionManager', 'newLogRequest', function($http, $window, appStatus, eatConfig, sessionManager, newLogRequest) {

    return function($scope) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/location-subscriptions',
            params : {
                token : sessionManager.getToken()
            }

        }).success(function(data) {

            appStatus.completed('locationSubscriptionsRequest');

            // Just one location subscription per user.
            if (data) {
                // It returns an array, but should only contain 1 location subscription.
                localStorage.setItem('loc', JSON.stringify(data.shift()));

                newLogRequest('redirected', 'index', 'locationSubscriptions-edit');

                $window.location.href = 'index.html';
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed('locationSubscriptionsRequest');

            // No subscriptions expected.
        });
    };
}]);
