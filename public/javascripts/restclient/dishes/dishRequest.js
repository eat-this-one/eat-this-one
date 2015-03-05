angular.module('eat-this-one')
    .factory('dishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'datesConverter', 'sessionManager', 'newLogRequest', function($http, appStatus, notifier, eatConfig, datesConverter, sessionManager, newLogRequest) {

    return function($scope, dishCallback, id) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id,
            params : { token : sessionManager.getToken() }

        })
        .success(dishCallback)
        .error(function(data, errorStatus, errorMsg) {
            appStatus.completed('dishRequest');
            newLogRequest('error', 'dish-view', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        });
    };

}]);
