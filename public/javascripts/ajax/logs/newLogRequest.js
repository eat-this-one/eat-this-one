angular.module('eat-this-one').factory('newLogRequest', ['$http', 'eatConfig', 'sessionManager', function($http, eatConfig, sessionManager) {

    return function(what, where) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/logs',
            data : {
                token : sessionManager.getToken(),
                what : what,
                where : where
            }
        }).success(function(data) {
            // No need to do anything.
        }).error(function(data, errorStatus, errorMsg) {
            // User should not know about this.
            console.log(data);
        });
    };
}]);
