angular.module('eat-this-one')
    .factory('locationSubscriptionsRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'newLogRequest', 'notifier', function(redirecter, $http, eatConfig, sessionManager, appStatus, newLogRequest, notifier) {

    return function($scope, locationSubscriptionsCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/location-subscriptions',
            params : {
                token : sessionManager.getToken()
            }

        })
        .success(locationSubscriptionsCallback)
        .error(errorCallback);
    };
}]);
