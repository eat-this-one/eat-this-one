angular.module('eat-this-one')
    .factory('mealsRequest', ['$http', 'eatConfig', 'sessionManager', function($http, eatConfig, sessionManager) {

    return function($scope, mealsCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/meals',
            params : {
                token : sessionManager.getToken()
            }

        })
        .success(mealsCallback)
        .error(errorCallback);
    };

}]);
