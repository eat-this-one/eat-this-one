angular.module('eat-this-one')
    .factory('newLocationSubscriptionRequest', ['$window', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', function($window, $http, eatConfig, sessionManager, appStatus, notifier) {

    return function($scope, locationid, locSubscriptionCallback, errorCallback) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/location-subscriptions',
            data : {
                locationid : locationid,
                token : sessionManager.getToken()
            }

        }).success(locSubscriptionCallback).error(errorCallback);
    };
}]);
