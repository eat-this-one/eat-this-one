angular.module('eat-this-one')
    .factory('dishesRequest', ['$http', 'notifier', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', function($http, notifier, eatConfig, sessionManager, appStatus, notifier) {

    return function($scope, dishesCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes',
            params : { token : sessionManager.getToken() }

        })
        .success(dishesCallback)
        .error(errorCallback);
    };

}]);
