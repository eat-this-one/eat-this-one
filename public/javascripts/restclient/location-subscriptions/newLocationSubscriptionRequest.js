angular.module('eat-this-one')
    .factory('newLocationSubscriptionRequest', ['redirecter', '$http', 'eatConfig', 'statics', 'sessionManager', 'appStatus', 'notifier', function(redirecter, $http, eatConfig, statics, sessionManager, appStatus, notifier) {

    return function($scope, locationid, locSubscriptionCallback, errorCallback) {

        var message = sessionManager.getUser().name + ' ' +
            $.eatLang.lang.lnjoined;

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/location-subscriptions',
            data : {
                locationid : locationid,
                token : sessionManager.getToken(),
                message : message
            }

        }).success(locSubscriptionCallback).error(errorCallback);
    };
}]);
