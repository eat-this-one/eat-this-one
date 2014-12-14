angular.module('eat-this-one')
    .factory('newLocationRequest', ['$window', '$http', 'eatConfig', 'sessionManager', function($window, $http, eatConfig, sessionManager) {

    return function($scope, name, address) {

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
