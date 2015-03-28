angular.module('eat-this-one')
    .factory('mealsRequest', ['$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function($http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, dishid, mealsCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/meals',
            params : {
                token : sessionManager.getToken(),
                dishid : dishid
            }
        })
        .success(mealsCallback)
        .error(function() {
            // We use dishRequest as it is the same used in dishes/view
            // this should be changed if we want to reuse it.
            appStatus.completed('dishRequest');
            newLogRequest('error', 'meals-request', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        });
    };

}]);
