angular.module('eat-this-one')
    .factory('locationsRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, name, locationCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/locations',
            params : {
                name : name,
                token : sessionManager.getToken()
            }

        }).success(locationCallback).error(errorCallback);
    };
}]);
