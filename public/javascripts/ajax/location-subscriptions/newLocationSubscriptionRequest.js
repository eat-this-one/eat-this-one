angular.module('eat-this-one')
    .factory('newLocationSubscriptionRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function(locationid) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/location-subscriptions',
            data : {
                locationid : locationid,
                token : sessionManager.getToken()
            }

        }).success(function(data) {
            //var msg = 'Subscribed!';
            //notifier.show(msg, 'success');
            //appStatus.completed();
            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            notifier.show(errorMsg, 'error');
            appStatus.completed();
        });
    };
}]);
