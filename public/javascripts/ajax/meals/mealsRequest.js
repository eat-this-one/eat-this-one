angular.module('eat-this-one')
    .factory('mealsRequest', ['$window', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function($window, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

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
