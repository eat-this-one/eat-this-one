angular.module('eat-this-one')
    .factory('newLocationRequest', ['$window', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function($window, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, name, address, locationCallback, errorCallback) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/locations',
            data : {
                name : name,
                address : address,
                token : sessionManager.getToken()
            }

        }).success(locationCallback).error(errorCallback);
    };
}]);
