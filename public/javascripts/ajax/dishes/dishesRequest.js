angular.module('eat-this-one')
    .factory('dishesRequest', ['$http', 'notifier', 'eatConfig', 'sessionManager', function($http, notifier, eatConfig, sessionManager) {

    // Callbacks dependencies should be specified
    // here as they will be executed here.
    return function($scope, dishesCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes',
            params : { token : sessionManager.getToken() }

        }).success(dishesCallback)
        .error(errorCallback);
    };

}]);
