angular.module('eat-this-one')
    .factory('dishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'mapsManager', 'datesConverter', 'sessionManager', function($http, appStatus, notifier, eatConfig, mapsManager, datesConverter, sessionManager) {

    return function($scope, dishCallback, id) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id,
            params : { token : sessionManager.getToken() }

        })
        .success(dishCallback)
        .error(function(data, errorStatus, errorMsg) {
            appStatus.completed('dishRequest');
            var msg = $scope.lang.errordishrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg);
        });
    };

}]);
