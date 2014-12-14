angular.module('eat-this-one')
    .factory('locationSubscriptionsRequest', ['$http', '$window', 'appStatus', 'eatConfig', 'notifier', 'sessionManager', 'newLogRequest', function($http, $window, appStatus, eatConfig, notifier, sessionManager, newLogRequest) {

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
            if (data && data.length > 0) {

                // It returns an array, but should only contain 1 location subscription.
                localStorage.setItem('loc', JSON.stringify(data.shift()));

                document.addEventListener('deviceready', function() {

                    newLogRequest('redirected', 'index', 'locationSubscriptions-edit');

                    notifier.show($scope.lang.alreadysubscribed, $scope.lang.subscribedlocationinfo, 'success');
                    $window.location.href = 'index.html';
                });
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed('locationSubscriptionsRequest');

            // No subscriptions expected.
        });
    };
}]);
