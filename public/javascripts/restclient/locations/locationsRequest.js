angular.module('eat-this-one')
    .factory('locationsRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, params, locationCallback, errorCallback) {

        params.token = sessionManager.getToken();

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/locations',
            params : params

        }).success(locationCallback).error(errorCallback);
    };
}]);
